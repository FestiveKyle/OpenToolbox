import React, { useRef } from 'react'
import { Flex } from '@chakra-ui/react'
import { Header } from './Header'
import { Navigate, Route, Routes } from 'react-router-dom'
import ToolboxPage from './ToolboxPage'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import PrivatePage from './PrivatePage'
import { HomePage } from './HomePage'
import FriendsPage from './FriendsPage'
import { SearchPage } from './SearchPage'
import PageNotFound from './404PageNotFound'

export const App = () => {
  const headerRef = useRef()

  return (
    <Flex flexDirection="column" minH="100vh">
      <Header headerRef={headerRef} />
      <Flex as="main" h="100%" flexGrow="1" px="2rem">
        <Routes>
          <Route path="/" element={<HomePage />} exact={true} />
          <Route
            path="toolbox"
            element={
              <PrivatePage>
                <ToolboxPage />
              </PrivatePage>
            }
          />
          <Route
            path="login"
            element={
              <LoginPage
                headerRef={headerRef}
                headerHeight={headerRef?.current?.contentHeight}
              />
            }
          />
          <Route
            path="friends"
            element={
              <PrivatePage>
                <FriendsPage />
              </PrivatePage>
            }
          />
          <Route
            path="search"
            element={
              <PrivatePage>
                <SearchPage />
              </PrivatePage>
            }
          />
          <Route path="register" element={<RegisterPage />} />
          <Route path="404" element={<PageNotFound />} />
          <Navigate to="/404" state={{ from: location }} />
        </Routes>
      </Flex>
    </Flex>
  )
}
