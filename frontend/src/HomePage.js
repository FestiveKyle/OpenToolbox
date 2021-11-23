import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'
import SearchArea from './SearchArea'

export const HomePage = () => {
  return (
    <Flex flexDirection="column" w="100%">
      <Heading textAlign="center" w="100%" mt="2rem">
        Home Page
      </Heading>
    </Flex>
  )
}