import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'
import { useTitle } from 'react-use'

export const HomePage = () => {
  useTitle('OpenToolbox - Home')
  return (
    <Flex flexDirection="column" w="100%">
      <Heading textAlign="center" w="100%" mt="2rem">
        Home Page
      </Heading>
    </Flex>
  )
}
