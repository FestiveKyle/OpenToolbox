import React from 'react'
import {
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useToast,
} from '@chakra-ui/react'
import {
  GET_MY_FRIEND_REQUESTS,
  GET_MY_FRIENDS,
  GET_USERS,
} from './graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { CheckIcon, DeleteIcon, StarIcon } from '@chakra-ui/icons'
import { ANSWER_FRIEND_REQUEST } from './graphql/mutations'
import { useUserState } from './hooks/useUserState'

const FriendRequestPopover = ({ ...props }) => {
  const { isLoggedIn, user } = useUserState()
  const { loading, error, data } = useQuery(GET_MY_FRIEND_REQUESTS, {
    pollInterval: 10000,
    skip: !isLoggedIn || !user,
  })

  const [
    answerFriendRequest,
    {
      data: answerFriendRequestData,
      answerFriendRequestLoading,
      answerFriendRequestError,
    },
  ] = useMutation(ANSWER_FRIEND_REQUEST, {
    update: (cache, { data }) => {
      cache.evict({ id: `FriendRequest:${data?.answerFriendRequest?._id}` })
      cache.gc()
    },
    refetchQueries: [GET_MY_FRIENDS, GET_USERS],
  })

  return (
    <Popover>
      <PopoverTrigger>
        <Button px="2rem" {...props}>
          Friend requests
          {data?.getMyFriendRequests?.length ? (
            <StarIcon position="absolute" right="0.75rem" color="orange" />
          ) : (
            ''
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Friend Requests</PopoverHeader>
        <PopoverBody>
          {data?.getMyFriendRequests?.length ? (
            data.getMyFriendRequests.map((friendRequest, idx) => {
              return (
                <Flex key={`friendRequest-${idx}`}>
                  <Text my="auto">
                    {friendRequest.from.firstName} {friendRequest.from.lastName}
                  </Text>
                  <IconButton
                    aria-label=""
                    ml="auto"
                    icon={<CheckIcon />}
                    onClick={async () => {
                      await answerFriendRequest({
                        variables: {
                          answer: 'ACCEPT',
                          friendRequestId: friendRequest._id,
                        },
                      })
                    }}
                  />
                  <IconButton
                    aria-label=""
                    ml="0.5rem"
                    icon={<DeleteIcon />}
                    onClick={async () => {
                      await answerFriendRequest({
                        variables: {
                          answer: 'REJECT',
                          friendRequestId: friendRequest._id,
                        },
                      })
                    }}
                  />
                </Flex>
              )
            })
          ) : (
            <Text>No friend requests</Text>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default FriendRequestPopover
