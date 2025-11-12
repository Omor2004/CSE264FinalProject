import React, { useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { AppBar, CssBaseline, Toolbar, Typography, Box, Button,
  Container, ThemeProvider, IconButton } from "@mui/material"

import {Home as HomeIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material'

import { ColorModeContext } from '../context/ColorModeContext'

const Layout = () => {
  const { toggleColorMode, mode } = useContext(ColorModeContext)

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        <CssBaseline/>
        <AppBar position='sticky'>
          <Toolbar>
            <Typography
              variant='h6'
              component={Link}
              to='/'
              onClick={'/'}
              sx={{ flexGrow: 1, fontWeight: 700, textDecoration: 'none', color: 'white' }}
            >

            </Typography>

            <Button color='inherit' component={Link} to='/' onClick={'/'} startIcon={<HomeIcon />} >
              Home
            </Button>

            <IconButton sx={{ ml: 1}} onClick={toggleColorMode} color='inherit'>
              {mode === 'dark' ? <LightModeIcon/> : <DarkModeIcon/>}
            </IconButton>
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

        <Box component='footer' sx={{ py: 3, bgcolor: 'grey.200', textAlign: 'center' }}>

        </Box>
      </Box>
    </>
  )
}

export default Layout