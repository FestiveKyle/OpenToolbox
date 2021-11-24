import React, { useLayoutEffect, useState } from 'react'
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
import { useUserState } from './hooks/useUserState'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTitle } from 'react-use'

export const LoginPage = ({ headerRef }) => {
  useTitle('OpenToolbox - Login')
  const { isLoggedIn, login } = useUserState()
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || '/'

  const [headerHeight, setHeaderHeight] = useState(null)

  useLayoutEffect(() => {
    setHeaderHeight(headerRef?.current?.contentHeight)
  }, [headerRef?.current?.contentHeight])

  const schema = yup.object({
    email: yup
      .string()
      .required('Email is required.')
      .email('Must enter a valid email.'),
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

  const logInUser = async ({ email, password }) => {
    await login({
      variables: { email, password },
      onCompleted: () => {
        reset()
        navigate(from, { replace: true })
      },
    })
  }

  if (isLoggedIn) return <Navigate to={from} replace={true} />

  return (
    <Flex mx="auto" my="4rem">
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
    </Flex>
  )
}
