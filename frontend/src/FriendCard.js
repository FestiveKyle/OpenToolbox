import React from 'react'
import { Flex, IconButton, Text, useToast } from '@chakra-ui/react'
import { CloseIcon, DeleteIcon } from '@chakra-ui/icons'
import { REMOVE_FRIEND } from './graphql/mutations'
import { useMutation } from '@apollo/client'

const FriendCard = ({ firstName, lastName, friendId, ...props }) => {
  const toast = useToast()
  const [removeFriendMutation, { data, loading, error }] = useMutation(
    REMOVE_FRIEND,
    {
      update: (cache, result) => {
        cache.evict({ id: `User:${result?.answerFriendRequest?._id}` })
        cache.gc()
      },
      onCompleted: (data) => {
        toast({
          title: 'Friend removed.',
          description: `Removed ${data?.addFriend?.firstName} ${data?.addFriend?.lastName} as friend`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      },
      onError: (error) => {
        toast({
          title: 'Error.',
          description: error,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
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
          icon={<DeleteIcon />}
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
