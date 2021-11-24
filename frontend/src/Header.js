import { Button, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { LogoutButton } from './LogoutButton'
import { useUserState } from './hooks/useUserState'
import { Link as RouteLink } from 'react-router-dom'
import FriendRequestPopover from './FriendRequestPopover'
import logo from './images/logo-default-monochrome.svg'

export const Header = ({ headerRef }) => {
  const { isLoggedIn, getUserLoading, user } = useUserState()

  return (
    <Flex
      flexDirection="column"
      bg="#3E6866"
      py="1rem"
      px="2rem"
      ref={headerRef}
    >
      <Flex flexDirection="row" w="100%" mb="2rem">
        <Image src={logo} alt="OpenToolbox" h="3rem" />

        {isLoggedIn && user ? (
          <>
            <Text ml="auto" mr="2rem" alignSelf="center" color="white">
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
          <Flex flexDirection="row">
            <Button as={RouteLink} to="/" mr="2rem">
              Home
            </Button>

            <Button as={RouteLink} to="/toolbox" mr="2rem">
              Toolbox
            </Button>

            <Button as={RouteLink} to="/friends" mr="2rem">
              Friends
            </Button>

            <Button as={RouteLink} to="/search">
              Search
            </Button>

            <FriendRequestPopover ml="auto" />
          </Flex>
        </>
      )}
    </Flex>
  )
}
