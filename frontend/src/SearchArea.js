import React, { useEffect, useState } from 'react'
import {
  Divider,
  Flex,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useQuery } from '@apollo/client'
import { GET_TOOLS, GET_USERS } from './graphql/queries'
import FriendCard from './FriendCard'
import UserCard from './UserCard'
import ToolCard from './ToolCard'

const SearchArea = () => {
  const [search, setSearch] = useState('')

  const {
    loading: getUsersLoading,
    error: getUsersError,
    data: getUserData,
  } = useQuery(GET_USERS, {
    variables: { search: search },
  })

  const {
    loading: getToolsLoading,
    error: getToolsError,
    data: getToolsData,
  } = useQuery(GET_TOOLS, {
    variables: { search: search },
  })

  return (
    <Flex flexDirection="column" width="100%">
      <InputGroup w="clamp(10rem, 40rem, 100%)" alignSelf="center" mb="2rem">
        <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
        <Input
          bg="white"
          placeholder="Search people and tools"
          aira-label="Search"
          onChange={(event) => {
            setSearch(event.target.value)
          }}
        />
      </InputGroup>

      <Heading as="h2" textAlign="center" mb="2rem">
        Users
      </Heading>

      <Grid gridTemplateColumns="repeat(3, 1fr)" gap="1rem">
        {getUserData?.getUsers.map((user, idx) => {
          return (
            <UserCard
              key={`userCard-${idx}`}
              userId={user._id}
              firstName={user.firstName}
              lastName={user.lastName}
            />
          )
        })}
      </Grid>

      <Divider orientation="horizontal" my="2rem" />

      <Heading as="h2" textAlign="center" mb="2rem">
        Tools
      </Heading>

      <Grid gridTemplateColumns="repeat(3, 1fr)" gap="1rem">
        {getToolsData?.getTools.map((tool, idx) => {
          return (
            <ToolCard
              key={`userCard-${idx}`}
              id={tool.id}
              name={tool.name}
              description={tool.description}
              brand={tool.brand}
            />
          )
        })}
      </Grid>
    </Flex>
  )
}

export default SearchArea
