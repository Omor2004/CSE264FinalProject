import React from 'react'
import Layout from './components/Layout'
import { ColorModeProvider } from './context/ColorModeProvider'

function App() {
  return (
    <ColorModeProvider>
      <Layout /> 
    </ColorModeProvider>
  )
}

export default App