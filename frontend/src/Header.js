import React from 'react'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { AuthenticateButton } from './AuthenticateButton'
import { useAuth0 } from '@auth0/auth0-react'

export const Header = () => {
  const { isAuthenticated, user } = useAuth0()

  return (
    <Flex flexDirection="column" bg="blue.300" py="1rem" px="2rem">
      <Flex flexDirection="row" w="100%">
        <Heading mr="auto">Toolbox</Heading>
        {isAuthenticated && (
          <Text my="auto" fontWeight="bold">
            Hello, {user.name}
          </Text>
        )}
        <AuthenticateButton ml="2rem" />
      </Flex>
    </Flex>
  )
}
