import React, { useState, useMemo } from 'react'
import { ThemeProvider } from '@mui/material'
import { ColorModeContext } from './ColorModeContext'
import { createAnimeTheme } from '../theme/theme'


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