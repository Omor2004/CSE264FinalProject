import React, { useState, useMemo, createContext, useContext } from 'react'
import { ThemeProvider } from '@mui/material'
import { createAnimeTheme } from '../theme/theme'

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'dark'
})

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark')

    const colorMode = useMemo(
      () => ({
        toggleColorMode: () => {
          setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
        },
        mode: mode,
      }),
      [mode],
    )

  const theme = useMemo(() => createAnimeTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export const useColorMode = () => useContext(ColorModeContext)