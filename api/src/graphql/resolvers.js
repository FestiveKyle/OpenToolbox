import { aql } from 'arangojs'
import bcrypt from 'bcrypt'

export const resolvers = {
  Query: {
    currentUser: (parent, args, context) => context.getUser(),
  },
  Mutation: {
    addTool: async (
      parent,
      { name, color, brand, photos, description, privacy },
      context,
    ) => {
      const currentUser = context.getUser()

      console.log(`User "${currentUser._id}" inserting new tool`)
      const newTool = await context.db
        .collection('tools')
        .save({ name, color, brand, photos, description, privacy })
      console.log(`New tool inserted by "${currentUser._id}": ${newTool}`)

      console.log(
        `Adding claim between new tool "${newTool._id}" and user "${currentUser._id}"`,
      )
      await context.db
        .collection('toolClaims')
        .insert({ _from: currentUser._id, _to: newTool._id })
      console.log(
        'New claim between new tool "${newTool._id}" and user "${currentUser._id}" created',
      )

      return { tool: newTool }
    },
    login: async (parent, { email, password }, context) => {
      const { user } = await context.authenticate('graphql-local', {
        email,
        password,
      })
      await context.login(user)
      return { user }
    },
    logout: (parent, args, context) => context.logout(),
    signup: async (
      parent,
      { firstName, lastName, email, password, privacy },
      context,
    ) => {
      const existingUser = await (
        await context.db.query(
          aql`FOR user IN users FILTER user.email == ${email} RETURN user`,
        )
      ).next()

      if (existingUser) {
        throw new Error(`Email already used`)
      }

      const hashedPassword = bcrypt.hashSync(password, 10)
      const userDetails = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        privacy,
      }
      const newUser = await (
        await context.db.query(
          aql`INSERT ${userDetails} INTO users LET inserted = NEW RETURN inserted`,
        )
      ).next()
      console.log(`New user created: ${JSON.stringify(newUser)}`)

      await context.login(newUser)
      return { user: newUser }
    },
  },
}
