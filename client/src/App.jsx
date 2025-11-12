import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import { ColorModeProvider } from './context/ColorModeProvider'


function App() {

  return (
    <ColorModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </ColorModeProvider>
  )
}

export default App;