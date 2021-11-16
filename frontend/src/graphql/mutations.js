import { gql } from '@apollo/client'

export const SIGN_UP = gql`
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
        _id
        email
        firstName
        lastName
      }
    }
  }
`
