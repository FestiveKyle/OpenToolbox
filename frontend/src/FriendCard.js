import React from 'react'
import { Flex, IconButton, Text } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { REMOVE_FRIEND } from './graphql/mutations'
import { useMutation } from '@apollo/client'

const FriendCard = ({ firstName, lastName, friendId, ...props }) => {
  const [removeFriendMutation, { data, loading, error }] = useMutation(
    REMOVE_FRIEND,
    {
      update: (cache, result) => {
        cache.evict({ id: `User:${result?.answerFriendRequest?._id}` })
        cache.gc()
      },
    },
  )

  return (
    <Flex
      direction="column"
      {...props}
      padding="1rem"
      bg="gray.200"
      borderRadius="1rem"
    >
      <Flex>
        <Text my="auto">
          <b>Name:</b> {firstName} {lastName}
        </Text>
        <IconButton
          aria-label=""
          ml="auto"
          bg="white"
          color="red"
          icon={<CloseIcon />}
          _hover={{ bg: 'black' }}
          onClick={async () => {
            await removeFriendMutation({
              variables: {
                friendId: friendId,
              },
            })
          }}
        />
      </Flex>
    </Flex>
  )
}

export default FriendCard
