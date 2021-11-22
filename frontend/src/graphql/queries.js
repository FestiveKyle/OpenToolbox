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
