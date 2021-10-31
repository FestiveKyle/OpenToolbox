import React from 'react'
import { Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { LoginButton } from './LoginButton'
import { Header } from './Header'
import { useAuth0 } from '@auth0/auth0-react'

export const App = () => {
  const { isLoading: isAuthLoading } = useAuth0()

  if (isAuthLoading)
    return (
      <Flex padding="1rem">
        <Spinner color="blue.400" />
        <Text ml="1rem">Loading...</Text>
      </Flex>
    )

  return (
    <Flex flexDirection="column">
      <Header />
    </Flex>
  )
}
