import { useQuery } from '@apollo/client'
import { Divider, Flex, Heading, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { GET_CURRENT_USER } from './graphql/queries'
import { LoginForm } from './LoginForm'
import { LogoutForm } from './LogoutForm'
import { RegisterForm } from './RegisterForm'
import { useUserState } from './hooks/useUserState'

export const Header = () => {
  const { isLoggedIn, getUserLoading, user } = useUserState()

  useEffect(() => {
    console.log('isLoggedIn: ', isLoggedIn)
    console.log('user: ', user)
  }, [isLoggedIn])

  return (
    <Flex flexDirection="column" bg="blue.300" py="1rem" px="2rem">
      <Flex flexDirection="row" w="100%">
        <Heading mr="auto">Toolbox</Heading>
      </Flex>
      {isLoggedIn ? (
        <>
          <Text>
            Welcome, {user.firstName} {user.lastName}
          </Text>
          <LogoutForm />
        </>
      ) : (
        <>
          <RegisterForm />
          <Divider orientation="horizontal" my="2rem" />
          <LoginForm />
        </>
      )}
    </Flex>
  )
}
