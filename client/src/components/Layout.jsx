import React, { useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'

import {
  PUBLIC_NAVIGATION_LINKS,
  AUTH_NAVIGATION_LINKS
} from '../config/config'

import { AppBar, CssBaseline, Toolbar, Typography, Box, Button,
  Container, useTheme, IconButton } from "@mui/material"

import { Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material'

import { ColorModeContext } from '../context/ColorModeContext'


const Layout = () => {
  const { toggleColorMode, mode } = useContext(ColorModeContext)
  const theme = useTheme()
  const isAuthenticated = false

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}>
        <CssBaseline/>
        <AppBar position='sticky'>
          <Toolbar>
            <Typography
              variant='h6'
              component={Link}
              to='/'
              sx={{ flexGrow: 1, fontWeight: 700, textDecoration: 'none', color: 'inherit' }}
            >
              AnimePulse
            </Typography>

            <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
              
            {PUBLIC_NAVIGATION_LINKS.map((link) => (
                <Button 
                  key={link.name} 
                  color='inherit' 
                  component={Link} 
                  to={link.path} 
                  startIcon={<link.icon />}
                >
                  {link.name}
                </Button>
            ))}
              
            {isAuthenticated ? (
              AUTH_NAVIGATION_LINKS.map((link) => (
                <Button 
                  key={link.name} 
                  color='inherit' 
                  component={Link} 
                  to={link.path} 
                  startIcon={<link.icon />}
                >
                  {link.name}
                </Button>
              ))
            ) : (
              <>
                <Button color='inherit' component={Link} to='/login'>
                  Login
                </Button>
                <Button color='primary' variant="contained" component={Link} to='/signup' sx={{ ml: 1 }}>
                  Sign Up
                </Button>
              </>
            )}

          </Toolbar>
        </AppBar>

        <Container
          maxWidth='lg'
          sx={{
            flexGrow: 1,
            pt: 4,
            pb: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          <Outlet />
        </Container>

        <Box component='footer' sx={{ py: 3, bgcolor: 'background.paper', textAlign: 'center' }}>

        </Box>
      </Box>
    </>
  )
}

export default Layout