export const typeDefs = /* GraphQL */ `
  type User {
    id: Int!
    """
    The user's name
    """
    firstName: String
    lastName: String
    email: String
    password: String
    tools: [Tool]
    friends: [User]
    friendRequests: [FriendRequest]
    privacy: String
  }

  type Tool {
    id: Int!
    name: String
    color: String
    brand: String
    photos: [String]
    notes: String
    owner: User
    locations: [Location]
    loans: [Loan]
    privacy: String
  }

  type FriendRequest {
    id: Int!
    from: User
    to: User
    time: Int
  }

  type Loan {
    id: Int!
    from: User
    to: User
    dateRequested: Int
    dateLent: Int
    dateReturned: Int
    notes: [Note]
  }

  type Location {
    id: Int!
    user: User
    location: String
    date: Int
  }

  type Note {
    id: Int!
    user: User
    note: String
    date: Int
  }

  enum Privacy {
    PUBLIC
    PRIVATE
  }

  type Query {
    tools: [Tool]
  }

  type AuthPayload {
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      privacy: Privacy!
    ): AuthPayload
  }
`
