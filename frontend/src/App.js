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
import ToolboxPage from './ToolboxPage'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import PrivatePage from './PrivatePage'
import { HomePage } from './HomePage'
import FriendsPage from './FriendsPage'

export const App = () => {
  const headerRef = useRef()

  return (
    <Flex flexDirection="column" minH="100vh">
      <Header headerRef={headerRef} />
      <Flex as="main" h="100%" flexGrow="1" px="2rem">
        <Routes>
          <Route path="/" element={<HomePage />} exact={true} />
          <Route
            path="/toolbox"
            element={
              <PrivatePage>
                <ToolboxPage />
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
          <Route
            path="/friends"
            element={
              <PrivatePage>
                <FriendsPage />
              </PrivatePage>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Flex>
    </Flex>
  )
}
