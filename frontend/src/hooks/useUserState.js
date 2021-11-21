import { GET_CURRENT_USER } from '../graphql/queries'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { LOG_IN, LOG_OUT } from '../graphql/mutations'
import { CURRENT_USER_FIELDS } from '../graphql/fragments'

const UserContext = createContext({})

export const useUserState = () => useContext(UserContext)

export const UserStateProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const client = useApolloClient()

  const [login, { data: loginData, loading: loginLoading, error: loginError }] =
    useMutation(LOG_IN, {
      onCompleted: (data) => {
        console.log(data)
      },
      onError: (error) => {
        console.error(error)
      },
      update: (
        cache,
        {
          data: {
            login: { user },
          },
        },
      ) => {
        cache.writeQuery({
          query: GET_CURRENT_USER,
          data: { currentUser: user },
        })
      },
    })

  const {
    loading: getUserLoading,
    error: getUserError,
    data: getUserData,
  } = useQuery(GET_CURRENT_USER)

  const [
    logout,
    { data: logoutData, loading: logoutLoading, error: logoutError },
  ] = useMutation(LOG_OUT, {
    onCompleted: async () => {
      await client.resetStore()
    },
  })

  useEffect(() => {
    setIsLoggedIn(!!getUserData?.currentUser?._id)
  }, [getUserData])

  const userState = {
    isLoggedIn,
    user: getUserData?.currentUser,
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
