import React from 'react'
import { Box } from '@mui/material'
import SplashContent from '../components/SplashScreenContext'
import backgroundImage from '../images/background.jpg'

const BACKGROUND_IMAGE_URL = backgroundImage

const HomePage = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // --- Background Styling ---
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
        },
      }}
    >
      <SplashContent />
    </Box>
  )
}

export default HomePage