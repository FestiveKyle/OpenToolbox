import React from 'react'
import { Flex, IconButton, Text, useToast } from '@chakra-ui/react'
import { useMutation } from '@apollo/client'
import { REMOVE_TOOL } from './graphql/mutations'
import { DeleteIcon } from '@chakra-ui/icons'

const OwnedToolCard = ({ name, brand, description, toolId, ...props }) => {
  const toast = useToast()

  const [removeToolMutation, { data, loading, error }] = useMutation(
    REMOVE_TOOL,
    {
      update: (cache, { data }) => {
        console.log(data)
        cache.evict({ id: `Tool:${data?.removeTool?._id}` })
        cache.gc()
      },
      onCompleted: (data) => {
        toast({
          title: 'Remove tool.',
          description: `Successfully removed ${data?.addTool?.name} from your toolbox`,
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
      flexDirection="row"
      padding="1rem"
      bg="gray.200"
      borderRadius="1rem"
      {...props}
    >
      <Flex direction="column">
        <Text>
          <b>Name:</b> {name}
        </Text>
        <Text>
          <b>Brand:</b> {brand}
        </Text>
        <Text>
          <b>Description:</b> {description}
        </Text>
      </Flex>
      <IconButton
        aria-label=""
        ml="auto"
        bg="white"
        color="red"
        icon={<DeleteIcon />}
        _hover={{ bg: 'black' }}
        onClick={async () => {
          await removeToolMutation({
            variables: {
              toolId: toolId,
            },
          })
        }}
      />
    </Flex>
  )
}

export default OwnedToolCard
