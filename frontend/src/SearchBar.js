import React from 'react'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

const SearchBar = () => {
  return (
    <InputGroup w="clamp(10rem, 40rem, 100%)" alignSelf="center">
      <InputLeftElement
        bg="white"
        pointerEvents="none"
        children={<SearchIcon />}
      />
      <Input
        bg="white"
        placeholder="Search people and tools"
        aira-label="Search"
      />
    </InputGroup>
  )
}

export default SearchBar
