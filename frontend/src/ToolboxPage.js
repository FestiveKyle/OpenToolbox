import React from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useUserState } from './hooks/useUserState'
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_TOOL } from './graphql/mutations'
import { GET_MY_TOOLS } from './graphql/queries'
import ToolCard from './ToolCard'

const ToolboxPage = () => {
  const {
    getMyToolLoading,
    getMyToolError,
    data: getMyToolsData,
  } = useQuery(GET_MY_TOOLS)

  const schema = yup.object({
    name: yup.string().required('Name is required.'),
    brand: yup.string(),
    // color: yup.string(),
    description: yup.string(),
    // privacy: yup.string().oneOf(['PUBLIC', 'FRIENDS', 'PRIVATE']),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) })

  const [addToolMutation, { data, loading, error }] = useMutation(ADD_TOOL, {
    onCompleted: (data) => {
      console.log(data)
    },
  })

  const addTool = async ({ name, brand, color, description }) => {
    await addToolMutation({ variables: { name, brand, color, description } })
  }

  console.log(getMyToolsData)

  return (
    <Flex mx="auto" my="2rem" flexDirection="column" w="100%">
      <Flex flexDirection="column" mx="auto">
        <form onSubmit={handleSubmit(addTool)}>
          <Text fontWeight="bold">Add tool</Text>
          <FormControl isInvalid={errors.name}>
            <FormLabel htmlFor="name">Tool name:</FormLabel>
            <Input
              {...register('name', { required: true })}
              placeholder="Tool name"
              bg="white"
              maxW="50ch"
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.brand} mt="1rem">
            <FormLabel htmlFor="brand">Brand:</FormLabel>
            <Input
              {...register('brand', { required: true })}
              placeholder="Brand"
              type="brand"
              bg="white"
              maxW="50ch"
            />
            <FormErrorMessage>{errors.brand?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.description} mt="1rem">
            <FormLabel htmlFor="description">Description:</FormLabel>
            <Input
              {...register('description', { required: true })}
              placeholder="Description"
              type="description"
              bg="white"
              maxW="50ch"
            />
            <FormErrorMessage>{errors.brand?.message}</FormErrorMessage>
          </FormControl>
          <Button type="submit" w="min-content" mt="1rem">
            Add tool
          </Button>{' '}
        </form>
      </Flex>

      <Divider orientation="horizontal" my="2rem" />

      <Heading as="h2" textAlign="center">
        Your Tools
      </Heading>
      {getMyToolLoading ? (
        <>
          <Text>Loading tools</Text>
          <Spinner size="lg" />
        </>
      ) : !getMyToolsData ? (
        <Text>No tools</Text>
      ) : (
        <Grid gridTemplateColumns="repeat(3, 1fr)">
          {getMyToolsData.getMyTools.map((toolData, idx) => {
            return (
              <ToolCard
                key={`toolCard-${idx}`}
                name={toolData.name}
                brand={toolData.brand}
                description={toolData.description}
              />
            )
          })}
        </Grid>
      )}
    </Flex>
  )
}

export default ToolboxPage
