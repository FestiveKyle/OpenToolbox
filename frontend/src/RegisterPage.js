import React from 'react'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@apollo/client'
import { SIGN_UP } from './graphql/mutations'
import { useUserState } from './hooks/useUserState'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

export const RegisterPage = () => {
  const { isLoggedIn, login } = useUserState()
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || '/'

  const schema = yup.object({
    email: yup
      .string()
      .required('Email is required.')
      .email('Must enter a valid email.'),
    firstName: yup.string().required('First name is required.'),
    lastName: yup.string().required('Last name is required.'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .max(24, 'Password can be at most 24 characters long.'),
    privacy: yup.string().required('Privacy is required.'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) })

  const [signUp, { data, loading, error }] = useMutation(SIGN_UP, {
    onCompleted: () => {
      reset({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        privacy: '',
      })
      navigate(from, { replace: true })
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const registerUser = async ({
    email,
    firstName,
    lastName,
    password,
    privacy,
  }) => {
    await signUp({
      variables: { email, firstName, lastName, password, privacy },
    })
  }

  if (isLoggedIn) return <Navigate to={from} replace={true} />

  return (
    <Flex mx="auto" my="4rem">
      <form onSubmit={handleSubmit(registerUser)}>
        <Flex flexDirection="column">
          <Text fontWeight="bold">Register</Text>
          <FormControl isInvalid={errors.email} mb="2rem">
            <FormLabel htmlFor="email">Email:</FormLabel>
            <Input
              {...register('email', { required: true })}
              placeholder="Email"
              bg="white"
              maxW="50ch"
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.firstName} mb="2rem">
            <FormLabel htmlFor="firstName">First name:</FormLabel>
            <Input
              {...register('firstName', { required: true })}
              placeholder="First name"
              bg="white"
              maxW="50ch"
            />
            <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.lastName} mb="2rem">
            <FormLabel htmlFor="lastName">Last name:</FormLabel>
            <Input
              {...register('lastName', { required: true })}
              placeholder="Last name"
              bg="white"
              maxW="50ch"
            />
            <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password} mb="2rem">
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
          <FormControl isInvalid={errors.privacy} mb="2rem">
            <FormLabel htmlFor="privacy">Privacy:</FormLabel>
            <Select
              placeholder="Select privacy"
              bg="white"
              w="fit-content"
              {...register('privacy', { required: true })}
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </Select>
            <FormErrorMessage>{errors.privacy?.message}</FormErrorMessage>
          </FormControl>
          <Button type="submit" w="min-content" mt="1rem">
            Register
          </Button>
        </Flex>
      </form>
    </Flex>
  )
}
