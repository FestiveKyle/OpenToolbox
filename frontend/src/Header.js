import React from 'react'
import { Divider, Flex, Heading, Text } from '@chakra-ui/react'
import { RegisterForm } from './RegisterForm'
import { LoginForm } from './LoginForm'
import { LogoutForm } from './LogoutForm'

export const Header = () => {
  return (
    <Flex flexDirection="column" bg="blue.300" py="1rem" px="2rem">
      <Flex flexDirection="row" w="100%">
        <Heading mr="auto">Toolbox</Heading>
      </Flex>
      <RegisterForm />
      <Divider orientation="horizontal" my="2rem" />
      <LoginForm />
      <Divider orientation="horizontal" my="2rem" />
      <LogoutForm />
    </Flex>
  )
}
