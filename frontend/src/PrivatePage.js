import React from 'react'
import { useUserState } from './hooks/useUserState'
import { Redirect, useLocation } from 'react-router-dom'

const PrivatePage = ({ children }) => {
  const { isLoggedIn } = useUserState()
  const location = useLocation()

  if (!isLoggedIn) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    )
  }

  return children
}

export default PrivatePage
