import express from 'express'
import passport from 'passport'
import session from 'express-session'
const cors = require('cors')
import cookieParser from 'cookie-parser'
const LocalStrategy = require('passport-local').Strategy
import { Database, aql } from 'arangojs'
require('dotenv').config()

const { ARANGO_ROOT_PASSWORD, ARANGO_URL, ARANGO_DATABASE_NAME } = process.env

// connect to database, ensure required database and collections exist
;(async () => {
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
})()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(
  session({ secret: 'secretcode', resave: true, saveUninitialized: true }),
)
app.use(cookieParser('secretcode'))

app.post('/login', (req, res) => {
  console.log(req.body)
})
app.post('/register', (req, res) => {
  console.log(req.body)
})
app.post('/logout', (req, res) => {
  console.log(req.body)
})
app.post('/user', (req, res) => {
  console.log(req.body)
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
