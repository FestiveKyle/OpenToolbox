import React from 'react'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'

export const RegisterForm = () => {
  const registerUser = async ({ email, name, password }) => {
    let registerResponse
    try {
      registerResponse = await axios({
        method: 'post',
        data: { email, name, password },
        withCredentials: true,
        url: 'http://localhost:4000/register',
      })
    } catch (err) {
      alert(err)
      console.log(err)
      return
    }

    console.log(registerResponse)
  }

  const schema = yup.object({
    email: yup
      .string()
      .required('Email is required.')
      .email('Must enter a valid email.'),
    name: yup.string().required('Name is required.'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .max(24, 'Password can be at most 24 characters long.'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) })
  return (
    <form onSubmit={handleSubmit(registerUser)}>
      <Flex flexDirection="column">
        <Text fontWeight="bold">Register</Text>
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
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Name:</FormLabel>
          <Input
            {...register('name', { required: true })}
            placeholder="Name"
            bg="white"
            maxW="50ch"
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password}>
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
        <Button type="submit" w="min-content">
          Register
        </Button>
      </Flex>
    </form>
  )
}
