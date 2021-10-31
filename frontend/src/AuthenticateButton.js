import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { LogoutButton } from './LogoutButton'
import { LoginButton } from './LoginButton'

export const AuthenticateButton = ({ ...props }) => {
  const { isAuthenticated } = useAuth0()

  return isAuthenticated ? (
    <LogoutButton {...props} />
  ) : (
    <LoginButton {...props} />
  )
}
