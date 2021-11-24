import React from 'react'
import { Flex, Grid, Heading, Spinner, Text } from '@chakra-ui/react'
import { GET_MY_FRIENDS } from './graphql/queries'
import { useQuery } from '@apollo/client'
import FriendCard from './FriendCard'
import { useTitle } from 'react-use'

const FriendsPage = () => {
  useTitle('OpenToolbox - Friends')
  const { loading, error, data } = useQuery(GET_MY_FRIENDS)

  return (
    <Flex mx="auto" my="2rem" flexDirection="column" w="100%">
      <Heading textAlign="center">Friends</Heading>
      {loading ? (
        <>
          <Text>Loading tools</Text>
          <Spinner size="lg" />
        </>
      ) : !data ? (
        <Text>No friends...yet!</Text>
      ) : (
        <Grid gridTemplateColumns="repeat(3, 1fr)">
          {data.getMyFriends.map((friend, idx) => {
            return (
              <FriendCard
                key={`friendCard-${idx}`}
                friendId={friend._id}
                firstName={friend.firstName}
                lastName={friend.lastName}
              />
            )
          })}
        </Grid>
      )}
    </Flex>
  )
}

export default FriendsPage
