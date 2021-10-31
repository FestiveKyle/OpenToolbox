import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@chakra-ui/react'

export const LogoutButton = ({ ...props }) => {
  const { logout } = useAuth0()

  return (
    <Button
      {...props}
      variant="outline"
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Log Out
    </Button>
  )
}
