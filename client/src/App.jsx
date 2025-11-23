import React from 'react'
import { Routes, Route } from 'react-router-dom'

import {
  PUBLIC_NAVIGATION_LINKS,
  AUTH_NAVIGATION_LINKS
} from './config/config'

import Layout from './components/Layout'
import Signup from './pages/Signup'
import { ColorModeProvider } from './context/ColorModeProvider'



function App() {
  const allLinks = [...PUBLIC_NAVIGATION_LINKS, ...AUTH_NAVIGATION_LINKS]

  return (
    <ColorModeProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
        {allLinks.map((link) => (
        <Route key={link.path} path={link.path} element={<link.component />} />
        ))}
          <Route path='/login' element={<Signup />} />
          <Route path='/signup' element={<h1>Sign Up Page Placeholder</h1>} />
          <Route path='*' element={<h1>404 Not Found</h1>} />
        </Route>
      </Routes>
    </ColorModeProvider>
  )
}

export default App;