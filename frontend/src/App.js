import React, { useRef } from 'react'
import { Flex } from '@chakra-ui/react'
import { Header } from './Header'
import { Route, Routes, Switch } from 'react-router-dom'
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
        <Switch>
          <Route path="/" component={HomePage} exact={true} />
          <Route
            path="/toolbox"
            exact
            render={() => {
              return (
                <PrivatePage>
                  <ToolboxPage />
                </PrivatePage>
              )
            }}
          />
          <Route
            path="/login"
            exact
            render={() => {
              return (
                <LoginPage
                  headerRef={headerRef}
                  headerHeight={headerRef?.current?.contentHeight}
                />
              )
            }}
          />
          <Route
            path="/friends"
            exact
            render={() => (
              <PrivatePage>
                <FriendsPage />
              </PrivatePage>
            )}
          />
          <Route
            path="/search"
            exact
            render={() => (
              <PrivatePage>
                <SearchPage />
              </PrivatePage>
            )}
          />
          <Route path="/register" component={RegisterPage} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </Flex>
    </Flex>
  )
}
