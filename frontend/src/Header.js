import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'
import { AuthenticateButton } from './AuthenticateButton'
import { useAuth0 } from '@auth0/auth0-react'

export const Header = () => {
  const { isAuthenticated, user } = useAuth0()

  return (
    <Flex flexDirection="column" bg="blue.300" py="1rem" px="2rem">
      <Flex flexDirection="row" w="100%">
        <Heading>Toolbox</Heading>
        {}
        <AuthenticateButton ml="auto" />
      </Flex>
    </Flex>
  )
}
