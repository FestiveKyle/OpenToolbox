import React from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useUserState } from './hooks/useUserState'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import { useMutation } from '@apollo/client'
import { ADD_TOOL } from './graphql/mutations'

const AddToolPage = () => {
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

  return (
    <Flex mx="auto" my="2rem">
      <form onSubmit={handleSubmit(addTool)}>
        <Flex flexDirection="column">
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
            Login
          </Button>
        </Flex>
      </form>
    </Flex>
  )
}

export default AddToolPage
