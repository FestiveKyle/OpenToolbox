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

const AddToolPage = () => {
  const schema = yup.object({
    name: yup.string().required('Name is required.'),
    brand: yup.string(),
    color: yup.string(),
    description: yup.string(),
    privacy: yup.string().oneOf(['PUBLIC', 'FRIENDS', 'PRIVATE']),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) })

  return (
    <form onSubmit={handleSubmit(logInUser)}>
      <Flex flexDirection="column">
        <Text fontWeight="bold">Login</Text>
        <FormControl isInvalid={errors.email}>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <Input
            {...register('email', { required: true })}
            placeholder="Email"
            bg="white"
            maxW="50ch"
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password} mt="1rem">
          <FormLabel htmlFor="password">Password:</FormLabel>
          <Input
            {...register('password', { required: true })}
            placeholder="Password"
            type="password"
            bg="white"
            maxW="50ch"
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        <Button type="submit" w="min-content" mt="1rem">
          Login
        </Button>
      </Flex>
    </form>
  )
}

export default AddToolPage
