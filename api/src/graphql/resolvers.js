import { aql } from 'arangojs'

export const resolvers = {
  Query: {
    currentUser: (parent, args, context) => context.getUser(),
  },
  Mutation: {
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

      const userDetails = { firstName, lastName, email, password, privacy }
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
