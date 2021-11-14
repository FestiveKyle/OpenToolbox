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

const cors = require('cors')

require('dotenv').config()
const {
  ARANGO_ROOT_PASSWORD,
  ARANGO_URL,
  ARANGO_DATABASE_NAME,
  API_URL,
  API_PORT,
  FRONTEND_URL,
  FRONTEND_PORT,
  SESSION_SECRET,
  REDIS_PASSWORD,
} = process.env

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({ password: REDIS_PASSWORD })

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
    friendRequests: 'edge',
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

  return db
}

const runServer = async () => {
  const db = await setUpDatabase()

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    const matchingUser = db.query(
      aql`FOR user IN users FILTER user._id == ${id} RETURN user`,
    )
    done(null, matchingUser)
  })

  passport.use(
    new GraphQLLocalStrategy((email, password, done) => {
      const user = db.query(
        aql`FOR user IN users FILTER user.email == ${email} RETURN user`,
      )
      if (!user) {
        console.log(`Attempted login for user that does not exist: ${email}`)
        return done(new Error('Email or password are incorrect.'))
      }
      if (user?.password !== password) {
        console.log(`Incorrect password given during login for user: ${email}`)
        return done(new Error('Email or password are incorrect.'))
      }
      done(null, user)
    }),
  )

  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(
    cors({ origin: `${FRONTEND_URL}:${FRONTEND_PORT}`, credentials: true }),
  )
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      genid: (req) => uuidv4(),
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true },
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(cookieParser('secretcode'))

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
  server.applyMiddleware({ app, path: '/graphql' })

  await new Promise((resolve) => httpServer.listen(4000, resolve))
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
}

;(async () => {
  await runServer()
})()
