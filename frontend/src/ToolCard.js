import React from 'react'
import { Flex, Text } from '@chakra-ui/react'

const ToolCard = ({ name, brand, description, owner, ...props }) => {
  return (
    <Flex
      direction="column"
      {...props}
      padding="1rem"
      bg="gray.200"
      borderRadius="1rem"
    >
      <Text>
        <b>Name:</b> {name}
      </Text>
      <Text>
        <b>Brand:</b> {brand}
      </Text>
      <Text>
        <b>Description:</b> {description}
      </Text>
      {owner && (
        <Text>
          <b>Owner:</b> {owner}
        </Text>
      )}
    </Flex>
  )
}

export default ToolCard
