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
import { GET_USERS } from './graphql/queries'
import FriendCard from './FriendCard'
import UserCard from './UserCard'

const SearchArea = () => {
  const [search, setSearch] = useState('')

  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { search: search },
  })

  useEffect(() => {
    console.log(data)
  }, [data])

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
        {data?.getUsers.map((user, idx) => {
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
    </Flex>
  )
}

export default SearchArea
