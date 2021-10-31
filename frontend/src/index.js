import React from 'react'
import { render } from 'react-dom'

import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import { Auth0ProviderWithHistory } from './Auth0ProviderWithHistory'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'

render(
  <BrowserRouter>
    <Auth0ProviderWithHistory>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Auth0ProviderWithHistory>
  </BrowserRouter>,
  document.getElementById('root'),
)
