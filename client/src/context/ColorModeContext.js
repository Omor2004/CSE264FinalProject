import React, { useState, useMemo, createContext, useContext } from 'react'
import { ThemeProvider } from '@mui/materia'
import { createAnimeTheme } from '../theme/theme'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark')

    const colorMode = useMemo(
      () => ({
        toggleColorMode: () => {
          setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
        },
      }),
      [],
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