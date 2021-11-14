import React from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'

export const LogoutForm = () => {
  return (
    <Flex flexDirection="column">
      <Text fontWeight="bold">Logout</Text>
      <Button w="min-content" mt="1rem">
        Logout
      </Button>
    </Flex>
  )
}
