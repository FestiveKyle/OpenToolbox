import React from 'react'
import { Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { Header } from './Header'
import {
  BrowserRouter,
  Link as RouterLink,
  Route,
  Routes,
} from 'react-router-dom'
import { Link } from '@chakra-ui/react'

export const App = () => {
  return (
    <Flex flexDirection="column">
      <Header />
      <Routes>
        <Route path="/" element={''} />
        <Route path="/add-tool" element={''} />
      </Routes>
    </Flex>
  )
}
