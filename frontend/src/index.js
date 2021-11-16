import React from 'react'
import { render } from 'react-dom'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const apolloClient = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
})

render(
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'),
)
