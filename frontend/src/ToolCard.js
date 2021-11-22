import React from 'react'
import { Flex, Text } from '@chakra-ui/react'

const ToolCard = ({ name, brand, description, ...props }) => {
  return (
    <Flex direction="column" {...props}>
      <Text>
        <b>Name:</b> {name}
      </Text>
      <Text>
        <b>Brand:</b> {name}
      </Text>
      <Text>
        <b>Description:</b> {name}
      </Text>
    </Flex>
  )
}

export default ToolCard
