import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@chakra-ui/react'

export const LoginButton = ({ ...props }) => {
  const { loginWithRedirect } = useAuth0()

  return (
    <Button {...props} onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  )
}
