import express from 'express'
import passport from 'passport'
import redis from 'redis'
import session from 'express-session'
import { v4 as uuidv4 } from 'uuid'
import cookieParser from 'cookie-parser'
import { aql, Database } from 'arangojs'
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport'
import { typeDefs } from './src/graphql/types'
const { resolvers } = require('./src/graphql/resolvers')
const expressPlayground =
  require('graphql-playground-middleware-express').default

import { ApolloServer } from 'apollo-server-express'
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
import http from 'http'
import bcrypt from 'bcrypt'
import {
  ArangoSearchView,
  ArangoSearchViewPropertiesOptions,
} from 'arangojs/view'

const cors = require('cors')

if (!process.env?.SKIP_DOTENV) require('dotenv').config()
const {
  ARANGO_ROOT_PASSWORD,
  ARANGO_URL,
  ARANGO_DATABASE_NAME,
  FRONTEND_URL_FOR_CORS,
  SESSION_SECRETS,
  REDIS_URL,
  REDIS_PASSWORD,
} = process.env

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient(REDIS_URL, { password: REDIS_PASSWORD })

const { makeExecutableSchema } = require('@graphql-tools/schema')

const setUpDatabase = async () => {
  // connect to database, ensure required database and collections exist
  const systemDb = new Database({
    url: ARANGO_URL,
    auth: { username: 'root', password: ARANGO_ROOT_PASSWORD },
  })
  const appDatabaseNames = await systemDb.listDatabases()
  console.log('Current databases: ', appDatabaseNames)

  if (!appDatabaseNames.includes(ARANGO_DATABASE_NAME)) {
    console.log('Adding database: ', ARANGO_DATABASE_NAME)
    await systemDb.createDatabase(ARANGO_DATABASE_NAME)
  }
  const db = systemDb.database(ARANGO_DATABASE_NAME)
  db.useBasicAuth('root', ARANGO_ROOT_PASSWORD)

  const requiredCollectionTypes = {
    users: 'document',
    tools: 'document',
    toolClaims: 'edge',
    friendRequests: 'edge',
    friends: 'edge',
    loans: 'edge',
    locations: 'document',
    notes: 'document',
  }

  const collections = (await db.listCollections()).map((collection) => {
    return collection.name
  })

  console.log('Current collections in database: ', collections)

  for (const key of Object.keys(requiredCollectionTypes)) {
    // check if collection exists
    if (!collections.includes(key)) {
      console.log('adding collection: ', key)
      // collection does not exist, check which type the collection should be (document or edge)
      if (requiredCollectionTypes[key] === 'document') {
        await db.createCollection(key)
      } else {
        await db.createEdgeCollection(key)
      }
    }
  }

  // create indexes

  // create views
  const views = (await db.listViews()).map((view) => {
    return view.name
  })
  console.log('Current views in database: ', views)

  const requiredViews = {
    v_users: {
      links: {
        users: {
          includeAllFields: false,
          fields: {
            firstName: { analyzers: ['identity'] },
            lastName: { analyzers: ['identity'] },
            email: { analyzers: ['identity'] },
          },
        },
      },
    },
    v_tools: {
      links: {
        tools: {
          includeAllFields: false,
          fields: {
            name: { analyzers: ['text_en'] },
          },
        },
      },
    },
  }

  for (const key of Object.keys(requiredViews)) {
    // check if view exists
    if (!views.includes(key)) {
      console.log('adding view: ', key)
      // view does not exist, create view
      await db.createView(key, requiredViews[key])
    }
  }

  return db
}

const runServer = async () => {
  const db = await setUpDatabase()

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const matchingUser = await (
      await db.query(
        aql`FOR user IN users FILTER user._id == ${id} RETURN user`,
      )
    ).next()
    done(null, matchingUser)
  })

  passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {
      const user = await (
        await db.query(
          aql`FOR user IN users FILTER user.email == ${email} RETURN user`,
        )
      ).next()
      if (!user) {
        console.log(`Attempted login for user that does not exist: ${email}`)
        return done(new Error('Email or password are incorrect.'))
      }
      if (!bcrypt.compareSync(password, user?.password)) {
        console.log(`Incorrect password given during login for user: ${email}`)
        return done(new Error('Email or password are incorrect.'))
      }
      console.log(`User successfully logged in: ${email}`)
      // user and password matches, return user
      done(null, user)
    }),
  )

  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(
    cors({
      origin: FRONTEND_URL_FOR_CORS.split(','),
      credentials: true,
    }),
  )
  app.set('trust proxy', 1)
  function redirectWwwTraffic(req, res, next) {
    if (req.headers.host.slice(0, 4) === 'www.') {
      var newHost = req.headers.host.slice(4)
      return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl)
    }
    next()
  }
  app.use(redirectWwwTraffic)
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      genid: (req) => uuidv4(),
      secret: SESSION_SECRETS.split(', '),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: true,
      },
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
  // app.use(cookieParser('secretcode'))

  app.get(
    '/graphql',
    expressPlayground({
      endpoint: '/graphql',
    }),
  )

  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => buildContext({ req, res, db }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true,
    playground: true,
  })
  await server.start()
  server.applyMiddleware({ app, path: '/graphql', cors: false })

  await new Promise((resolve) => httpServer.listen(4000, resolve))
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
}

;(async () => {
  await runServer()
})()
