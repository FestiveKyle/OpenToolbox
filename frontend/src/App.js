import React from 'react'
import { Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { Header } from './Header'

export const App = () => {
  return (
    <Flex flexDirection="column">
      <Header />
    </Flex>
  )
}
