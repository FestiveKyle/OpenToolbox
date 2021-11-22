import React, { useRef } from 'react'
import { Button, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { Header } from './Header'
import {
  BrowserRouter,
  Link as RouterLink,
  Route,
  Routes,
} from 'react-router-dom'
import { Link } from '@chakra-ui/react'
import AddToolPage from './AddToolPage'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import PrivatePage from './PrivatePage'
import { HomePage } from './HomePage'

export const App = () => {
  const headerRef = useRef()

  return (
    <Flex flexDirection="column" minH="100vh">
      <Header headerRef={headerRef} />
      <Flex as="main" h="100%" flexGrow="1">
        <Routes>
          <Route path="/" element={<HomePage />} exact={true} />
          <Route
            path="/add-tool"
            element={
              <PrivatePage>
                <AddToolPage />
              </PrivatePage>
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                headerRef={headerRef}
                headerHeight={headerRef?.current?.contentHeight}
              />
            }
          />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Flex>
    </Flex>
  )
}
