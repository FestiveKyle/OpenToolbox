import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'
import SearchArea from './SearchArea'

export const SearchPage = () => {
  return (
    <Flex flexDirection="column" w="100%">
      <Heading as="h2" textAlign="center" mt="2rem">
        Search
      </Heading>

      <SearchArea />
    </Flex>
  )
}
