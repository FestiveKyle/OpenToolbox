import React from 'react'
import { Flex, Text } from '@chakra-ui/react'

const UserCard = ({ firstName, lastName, userId, ...props }) => {
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
      </Flex>
    </Flex>
  )
}

export default UserCard
