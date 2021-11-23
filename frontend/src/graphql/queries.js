import { gql } from '@apollo/client'
import { CURRENT_USER_FIELDS } from './fragments'

export const GET_CURRENT_USER = gql`
  ${CURRENT_USER_FIELDS}
  query CurrentUser {
    currentUser {
      ...CurrentUserFields
    }
  }
`

export const GET_MY_TOOLS = gql`
  query GetMyTools {
    getMyTools {
      _id
      name
      brand
      description
    }
  }
`

export const GET_MY_FRIENDS = gql`
  query GetMyFriends {
    getMyFriends {
      _id
      firstName
      lastName
    }
  }
`

export const GET_MY_FRIEND_REQUESTS = gql`
  query GetMyFriendRequests {
    getMyFriendRequests {
      _id
      from {
        _id
        firstName
        lastName
      }
    }
  }
`

export const GET_USERS = gql`
  query GetUsers($offset: Int, $limit: Int, $search: String) {
    getUsers(offset: $offset, limit: $limit, search: $search) {
      _id
      firstName
      lastName
      relationship
    }
  }
`

export const GET_TOOLS = gql`
  query GetTools($offset: Int, $limit: Int, $search: String) {
    getTools(offset: $offset, limit: $limit, search: $search) {
      _id
      name
      brand
      description
      owner {
        _id
        firstName
        lastName
      }
    }
  }
`
