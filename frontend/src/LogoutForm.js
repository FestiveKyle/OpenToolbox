import React from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useUserState } from './hooks/useUserState'

export const LogoutForm = () => {
  const { logout } = useUserState()

  return (
    <Flex flexDirection="column">
      <Text fontWeight="bold">Logout</Text>
      <Button w="min-content" mt="1rem" onClick={logout}>
        Logout
      </Button>
    </Flex>
  )
}
