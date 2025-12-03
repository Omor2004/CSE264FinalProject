import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/VpnKey'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'

const SplashContainer = () => {
  return (
    <Box
      sx={{
        borderRadius: '8px',
        zIndex: 10,
        p: 4,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        maxWidth: { xs: '90%', sm: '600px' },
        width: '100%',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Typography 
        variant='h2' 
        component='h1'
        color='primary'
        sx={{ 
          fontWeight: 900,
          mb: 2, 
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' 
        }}
      >
        Anime Pulse
      </Typography>

      <Typography 
        variant='h6' 
        sx={{ 
          color: '#333', 
          mb: 4, 
          fontWeight: 300 
        }}
      >
        Your centralized hub for tracking, reviewing, and discovering the latest anime releases.
      </Typography>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2 
        }}
      >
        {/* Row 1: Authentication Buttons */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            flexDirection: { xs: 'column', sm: 'row' } 
          }}
        >
          <Button
            component={Link}
            to='/login'
            variant='contained'
            size='large'
            startIcon={<LoginIcon />}
            backgroundColor= 'primary'
            
            sx={{
              '&:hover': { backgroundColor: '#dc2f02' },
              borderRadius: '12px',
              flexGrow: 1,
              py: 1.5,
            }}
          >
            Log In
          </Button>

          <Button
            component={Link}
            to='/signup'
            variant='outlined'
            size='large'
            startIcon={<HowToRegIcon />}
            color= 'primary'
            borderColor= 'primary'
            sx={{
              border: '2px solid',
              '&:hover': { 
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                borderColor: '#0d47a1'
              },
              borderRadius: '12px',
              flexGrow: 1,
              py: 1.5,
            }}
          >
            Sign Up
          </Button>
        </Box>

        {/* Row 2: Navigation Button (See Current Season) */}
        <Button
          component={Link}
          to='/current-season'
          variant='contained'
          color='success'
          size='large'
          startIcon={<AccessTimeFilledIcon />}
          sx={{
            color: '#fff',
            backgroundColor: '#370617',
            mt: 1,
            '&:hover': { backgroundColor: '#370617' },
            borderRadius: '12px',
            py: 1.5,
            fontWeight: 700,
          }}
        >
          See Current Season Anime
        </Button>
      </Box>
    </Box>
  )
}

export default SplashContainer