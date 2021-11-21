import { gql } from '@apollo/client'

export const CURRENT_USER_FIELDS = gql`
  fragment CurrentUserFields on User {
    _id
    firstName
    lastName
    email
    #      tools
    #      friends
    #      friendRequests
    privacy
  }
`
