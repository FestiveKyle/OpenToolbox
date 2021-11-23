import React from 'react'
import { Flex, IconButton, Text, useToast } from '@chakra-ui/react'
import { useMutation } from '@apollo/client'
import { ADD_FRIEND } from './graphql/mutations'
import { GET_MY_FRIENDS, GET_TOOLS } from './graphql/queries'
import { CheckCircleIcon, PlusSquareIcon } from '@chakra-ui/icons'

const UserCard = ({ firstName, lastName, userId, relationship, ...props }) => {
  const toast = useToast()
  const [addFriendMutation, { data, loading, error }] = useMutation(
    ADD_FRIEND,
    {
      refetchQueries: [GET_MY_FRIENDS, GET_TOOLS],
      onCompleted: (data) => {
        toast({
          title: 'Friend request sent.',
          description: `Friend request sent to ${data?.addFriend?.firstName} ${data?.addFriend?.lastName}`,
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

  let userIconButton
  switch (relationship) {
    case 'USER':
      userIconButton = (
        <IconButton
          aria-label=""
          ml="auto"
          my="auto"
          bg="green"
          color="white"
          icon={<PlusSquareIcon />}
          _hover={{ bg: 'orange' }}
          onClick={async () => {
            await addFriendMutation({
              variables: {
                friendId: userId,
              },
            })
          }}
        />
      )
      break

    case 'FRIEND':
      userIconButton = (
        <CheckCircleIcon
          display="block"
          boxSize="2rem"
          color="green"
          ml="auto"
          my="auto"
        />
      )
      break
  }

  return (
    <Flex
      direction="column"
      {...props}
      padding="1rem"
      bg="gray.200"
      borderRadius="1rem"
    >
      <Flex h="100%">
        <Text my="auto">
          <b>Name:</b> {firstName} {lastName}
        </Text>
        {userIconButton}
      </Flex>
    </Flex>
  )
}

export default UserCard
