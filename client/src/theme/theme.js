//#ffba08
//#faa307
//#f48c06
//#e85d04
//#dc2f02
//#d00000
//#9d0208
//#9d0208
//#370617
//#03071e 

import { createTheme } from '@mui/material'

const customColors = {
  primaryMain: '#e85d04',
  darkBackground: '#03071e',
  darkSurface: '#370617',
  lightBackground: '#fffffb',
  neutralGrey: '#e0e0e0',
}

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: customColors.primaryMain,
    },
    ...(mode === 'light'
      ? {
          background: {
            default: customColors.lightBackground,
            paper: customColors.primaryMain,
          },
          text: {
            primary: customColors.darkBackground,
            secondary: 'rgba(0, 0, 0, 0.6)',
          },
        }
      : {
          background: {
            default: customColors.darkBackground,
            paper: customColors.primaryMain,
          },
          text: {
            primary: customColors.neutralGrey,
            secondary: 'rgba(255, 255, 255, 0.7)',
          },
        }),
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
        }),
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})

export const createAnimeTheme = (mode) => createTheme(getDesignTokens(mode))
export default createAnimeTheme