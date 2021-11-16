import { gql } from '@apollo/client'

export const currentUser = gql`
  query CurrentUser {
    currentUser {
      _id
      firstName
      lastName
      email
      password
      #      tools
      #      friends
      #      friendRequests
      privacy
    }
  }
`
