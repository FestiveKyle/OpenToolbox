import { GET_CURRENT_USER } from '../graphql/queries'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { LOG_IN, LOG_OUT } from '../graphql/mutations'
import { CURRENT_USER_FIELDS } from '../graphql/fragments'

const UserContext = createContext({})

export const useUserState = () => useContext(UserContext)

export const UserStateProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const client = useApolloClient()

  const [login, { data: loginData, loading: loginLoading, error: loginError }] =
    useMutation(LOG_IN, {
      onCompleted: (data) => {
        setUser(data?.login?.user)
      },
      onError: (error) => {
        console.error(error)
      },
    })

  const {
    loading: getUserLoading,
    error: getUserError,
    data: getUserData,
  } = useQuery(GET_CURRENT_USER, {
    onCompleted: (data) => {
      setUser(data?.currentUser)
    },
  })

  const [
    logout,
    { data: logoutData, loading: logoutLoading, error: logoutError },
  ] = useMutation(LOG_OUT, {
    onCompleted: async () => {
      setUser(null)
      await client.clearStore()
    },
  })

  useEffect(() => {
    setIsLoggedIn(!!user?._id)
  }, [user?._id])

  const userState = {
    isLoggedIn,
    user,
    getUserLoading,
    getUserError,
    login,
    loginData,
    loginLoading,
    loginError,
    logout,
    logoutData,
    logoutLoading,
    logoutError,
  }

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  )
}
