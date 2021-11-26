import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'

const PageNotFound = () => {
  return (
    <Flex mx="auto" my="2rem" flexDirection="column" w="100%">
      <Heading as="h1" textAlign="center">
        Page not found
      </Heading>
    </Flex>
  )
}

export default PageNotFound
