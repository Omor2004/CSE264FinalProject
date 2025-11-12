import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import {
  PUBLIC_NAVIGATION_LINKS,
  AUTH_NAVIGATION_LINKS
} from './config/config'

import Layout from './components/Layout'
import { ColorModeProvider } from './context/ColorModeProvider'



function App() {
  const allLinks = [...PUBLIC_NAVIGATION_LINKS, ...AUTH_NAVIGATION_LINKS]

  return (
    <ColorModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
          {allLinks.map((link) => (
          <Route key={link.path} path={link.path} element={<link.component />} />
          ))}
            <Route path='/login' element={<h1>Login Page Placeholder</h1>} />
            <Route path='/signup' element={<h1>Sign Up Page Placeholder</h1>} />
            <Route path='*' element={<h1>404 Not Found</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ColorModeProvider>
  )
}

export default App;