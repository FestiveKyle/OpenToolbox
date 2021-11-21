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
  mutation AddTool($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        ... on User {
          ...CurrentUserFields
        }
      }
    }
  }
`