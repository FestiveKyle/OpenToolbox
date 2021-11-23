export const typeDefs = /* GraphQL */ `
  type User {
    _id: String!
    "The user's name"
    firstName: String
    lastName: String
    email: String
    tools: [Tool]
    friends: [User]
    friendRequests: [FriendRequest]
    privacy: String
    relationship: Relationship
  }

  type Tool {
    _id: String!
    name: String
    color: String
    brand: String
    photos: [String]
    description: String
    owner: User
    locations: [Location]
    loans: [Loan]
    privacy: String
  }

  type FriendRequest {
    _id: String!
    from: User
    to: User
    time: Int
  }

  type Loan {
    _id: String!
    from: User
    to: User
    dateRequested: Int
    dateLent: Int
    dateReturned: Int
    notes: [Note]
  }

  type Location {
    _id: String!
    user: User
    location: String
    date: Int
  }

  type Note {
    _id: String!
    user: User
    note: String
    date: Int
  }

  type AuthPayload {
    user: User
  }

  enum Privacy {
    PUBLIC
    FRIENDS
    PRIVATE
  }

  enum RequestAnswer {
    ACCEPT
    REJECT
  }

  enum Relationship {
    FRIEND
    USER
    SELF
  }

  type Query {
    tools: [Tool]
    currentUser: User
    getMyFriendRequests: [FriendRequest]
    getMyFriends(offset: Int, limit: Int): [User]
    getMyTools(offset: Int, limit: Int): [Tool]
    getUsers(offset: Int, limit: Int, search: String): [User]
    getTools(offset: Int, limit: Int, search: String): [Tool]
  }

  type Mutation {
    answerFriendRequest(
      answer: RequestAnswer!
      friendRequestId: String
    ): FriendRequest
    addFriend(friendId: String!): User
    removeFriend(friendId: String!): User
    login(email: String!, password: String!): AuthPayload
    logout: String
    signup(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      privacy: Privacy!
    ): AuthPayload
    addTool(
      name: String!
      color: String
      brand: String
      photos: [String]
      description: String
      privacy: Privacy
    ): Tool
    removeTool(toolId: String!): Tool
  }
`
