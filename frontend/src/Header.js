import { useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react'
import React, { createRef, useEffect } from 'react'
import { GET_CURRENT_USER } from './graphql/queries'
import { LoginPage } from './LoginPage'
import { LogoutButton } from './LogoutButton'
import { RegisterPage } from './RegisterPage'
import { useUserState } from './hooks/useUserState'
import { Link as RouteLink } from 'react-router-dom'
import { SearchIcon } from '@chakra-ui/icons'
import SearchBar from './SearchBar'

export const Header = ({ headerRef }) => {
  const { isLoggedIn, getUserLoading, user } = useUserState()

  useEffect(() => {
    console.log('isLoggedIn: ', isLoggedIn)
    console.log('user: ', user)
  }, [isLoggedIn])

  return (
    <Flex
      flexDirection="column"
      bg="blue.300"
      py="1rem"
      px="2rem"
      ref={headerRef}
    >
      <Flex flexDirection="row" w="100%">
        <Heading mr="auto">Toolbox Sharing</Heading>
      </Flex>
      <Flex mb="2rem">
        {isLoggedIn ? (
          <>
            <Text ml="auto" mr="2rem" alignSelf="center">
              <b>Welcome</b>, {user.firstName} {user.lastName}
            </Text>
            <LogoutButton />
          </>
        ) : (
          <>
            <Button as={RouteLink} to="/login" mr="2rem" ml="auto">
              Login
            </Button>
            <Button as={RouteLink} to="/register">
              Register
            </Button>
          </>
        )}
      </Flex>

      {isLoggedIn && (
        <>
          <SearchBar />

          <Flex flexDirection="row">
            <Button as={RouteLink} to="/" mr="2rem">
              Home
            </Button>

            <Button as={RouteLink} to="/add-tool">
              Add tool
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  )
}
