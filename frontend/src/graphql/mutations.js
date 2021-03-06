import { gql } from '@apollo/client'
import { CURRENT_USER_FIELDS } from './fragments'

export const SIGN_UP = gql`
  ${CURRENT_USER_FIELDS}
  mutation SignUp(
    $email: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $privacy: Privacy!
  ) {
    signup(
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
      privacy: $privacy
    ) {
      user {
        ... on User {
          ...CurrentUserFields
        }
      }
    }
  }
`

export const LOG_IN = gql`
  ${CURRENT_USER_FIELDS}
  mutation LogIn($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        ... on User {
          ...CurrentUserFields
        }
      }
    }
  }
`

export const LOG_OUT = gql`
  mutation LogOut {
    logout
  }
`

export const ADD_TOOL = gql`
  mutation AddTool(
    $name: String!
    $color: String
    $brand: String
    $photos: [String]
    $description: String
    $privacy: Privacy
  ) {
    addTool(
      name: $name
      color: $color
      brand: $brand
      photos: $photos
      description: $description
      privacy: $privacy
    ) {
      _id
      name
      color
      brand
      photos
      description
      privacy
    }
  }
`

export const REMOVE_TOOL = gql`
  mutation RemoveTool($toolId: String!) {
    removeTool(toolId: $toolId) {
      _id
      name
    }
  }
`

export const ADD_FRIEND = gql`
  mutation AddFriend($friendId: String!) {
    addFriend(friendId: $friendId) {
      _id
      firstName
      lastName
    }
  }
`

export const ANSWER_FRIEND_REQUEST = gql`
  mutation AnswerFriendRequest(
    $answer: RequestAnswer!
    $friendRequestId: String!
  ) {
    answerFriendRequest(answer: $answer, friendRequestId: $friendRequestId) {
      _id
    }
  }
`

export const REMOVE_FRIEND = gql`
  mutation RemoveFriend($friendId: String!) {
    removeFriend(friendId: $friendId) {
      _id
    }
  }
`
