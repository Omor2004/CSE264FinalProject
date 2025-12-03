import React, { useState,useEffect, useContext, useRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

import {
  PUBLIC_NAVIGATION_LINKS,
  ANIME_DROPDOWN_LINKS,
  AUTH_NAVIGATION_LINKS
} from '../config/config'

import { AppBar, CssBaseline, Toolbar, Typography, Box, Button,
  Container, useTheme, IconButton, Menu, MenuItem, Avatar } from "@mui/material"

import { Home as HomeIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material'

import { ColorModeContext } from '../context/ColorModeContext'


const Layout = () => {
  const { toggleColorMode, mode } = useContext(ColorModeContext)
  const theme = useTheme()

  const { session, signOut } = UserAuth() || {}
  const isAuthenticated = Boolean(session?.user)
  const userId = session?.user?.id

  const [avatarUrl, setAvatarUrl] = useState('')

  const animeButtonRef = useRef(null)
  
  // this is to determine the current page, because the home page has a slightly change on the padding 
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const [anchorElNav, setAnchorElNav] = useState(null)

  useEffect(() => {
    if (isAuthenticated && userId) {
      const fetchAvatarUrl = async () => {
        try {
          const response = await fetch(`http://localhost:3000/users/${userId}`)
          if (response.ok) {
            const data = await response.json()
            setAvatarUrl(data.avatar || '')
          }
        } catch (error) {
          console.error('Failed to fetch avatar URL:', error)
        }
      }
      fetchAvatarUrl()
    }
  }, [isAuthenticated, userId])

  const handleNavMenuOpen = (event) => {
    if (animeButtonRef.current) {
      setTimeout(() => {
        animeButtonRef.current.focus()
      }, 50)
    }
    setAnchorElNav(event.currentTarget)
  }

  const handleNavMenuClose = () => {
    setAnchorElNav(null)
  }

  // change when is HomePage '/' 
  const containerStyles = {
    flexGrow: 1,
    pt: isHomePage ? 0 : 4,
    pb: isHomePage ? 0 : 8,
    px: isHomePage ? 0 : 3,
    
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: isHomePage ? 'center' : 'flex-start',
  }

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

            {isAuthenticated ? (
              <>

                <IconButton
                  component={Link}
                  to={`/profile/${userId}`}
                  sx={{ ml: 1 }}
                  title="Your profile"
                  color="inherit"
                >
                  <Avatar src={avatarUrl} alt="Profile" sx={{ width: 32, height: 32 }} />
                </IconButton>

                <Button color='inherit' onClick={signOut} sx={{ ml: 1 }}>
                  Sign out
                </Button>
              </>
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

          <Toolbar>
            <Button
              key="Anime"
              color='inherit'
              component={Link}
              to='/'
              startIcon={<HomeIcon />}
              ref={animeButtonRef}
              onMouseEnter={handleNavMenuOpen}
              aria-controls={anchorElNav ? 'anime-hover-menu' : undefined}
              aria-haspopup="true"
            >
              Anime
            </Button>

            <Menu
              id="anime-hover-menu"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleNavMenuClose}
              disableAutoFocus={false}
              disableRestoreFocus={false}
              transitionDuration={150}
            >
              {ANIME_DROPDOWN_LINKS.map((link) => (
                <MenuItem
                  key={link.name}
                  onClick={handleNavMenuClose}
                  component={Link}
                  to={link.path}
                >
                  {link.name}
                </MenuItem>
              ))}
            </Menu>

            <Box sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'flex-end'
            }}>
              {PUBLIC_NAVIGATION_LINKS
                .filter(link => link.name !== 'Anime')
                .map((link) => (
                  <Button
                    key={link.name}
                    color='inherit'
                    component={Link}
                    to={link.path}
                    {...(link.icon && { startIcon: <link.icon /> })}
                  >
                    {link.name}
                  </Button>
                ))}

              <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

          {/* when padding is removed */}
        <Container
          maxWidth={isHomePage ? false : 'lg'}
          disableGutters={isHomePage}
          sx={containerStyles} 
        >
          <Outlet />
        </Container>

        <Box component='footer' sx={{ py: 3, bgcolor: 'background.paper', textAlign: 'center' }} />

      </Box>
    </>
  )
}


export default Layout