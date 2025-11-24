import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import { RouterProvider } from "react-router-dom"
import { router } from "./router.jsx";
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ColorModeProvider } from './context/ColorModeProvider'

// import { ThemeProvider } from '@mui/material/styles'
// import { createAnimeTheme } from './theme/theme'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ColorModeProvider>
      <AuthContextProvider>
        <RouterProvider router={router}/> 
      </AuthContextProvider>
    </ColorModeProvider>
  </StrictMode>
)
