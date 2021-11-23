import React from 'react'
import { Button } from '@chakra-ui/react'
import { useUserState } from './hooks/useUserState'

export const LogoutButton = ({ ...props }) => {
  const { logout } = useUserState()

  return (
    <Button w="min-content" onClick={logout} aria-label="Logout" {...props}>
      Logout
    </Button>
  )
}
