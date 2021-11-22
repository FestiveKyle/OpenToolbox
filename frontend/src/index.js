import React from 'react'
import { render } from 'react-dom'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { UserStateProvider } from './hooks/useUserState'

const apolloClient = new ApolloClient({
  uri: process.env.REACT_APP_API_ENDPOINT || '/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
})

render(
  <ApolloProvider client={apolloClient}>
    <UserStateProvider>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </UserStateProvider>
  </ApolloProvider>,
  document.getElementById('root'),
)
