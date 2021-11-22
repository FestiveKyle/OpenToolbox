import React from 'react'
import { Flex, Text } from '@chakra-ui/react'

const FriendCard = ({ firstName, lastName, ...props }) => {
  return (
    <Flex
      direction="column"
      {...props}
      padding="1rem"
      bg="gray.200"
      borderRadius="1rem"
    >
      <Text>
        <b>Name:</b> {firstName} {lastName}
      </Text>
    </Flex>
  )
}

export default FriendCard
