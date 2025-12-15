import React from 'react'
import { Box, Typography, IconButton, Container } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'

const AppFooter = () => {
  const socialLinks = [
    { 
      icon: <FacebookIcon fontSize="small" />, 
      url: 'https://www.facebook.com/yourprofile', 
      label: 'Facebook' 
    },
    { 
      icon: <TwitterIcon fontSize="small" />, 
      url: 'https://www.twitter.com/yourprofile', 
      label: 'Twitter/X' 
    },
    { 
      icon: <InstagramIcon fontSize="small" />, 
      url: 'https://www.instagram.com/yourprofile', 
      label: 'Instagram' 
    },
    { 
      icon: <LinkedInIcon fontSize="small" />, 
      url: 'https://www.linkedin.com/in/yourprofile', 
      label: 'LinkedIn' 
    },
    { 
      icon: <GitHubIcon fontSize="small" />, 
      url: 'https://www.github.com/yourrepo', 
      label: 'GitHub' 
    },
  ]

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        padding: 3,
        // Using `marginTop: 'auto'` pushes the footer to the bottom 
        // if the containing Box (in App.jsx) has minHeight: '100vh'.
        marginTop: 'auto', 
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' }, // Stack on small screens
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          {/* Copyright Text */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 0 } }}>
            {'Copyright © '}
            {new Date().getFullYear()} {'Anime Pulse.'}
          </Typography>

          {/* Social Media Icons Container */}
          <Box>
            {socialLinks.map((link) => (
              <IconButton 
                key={link.label} 
                aria-label={link.label} 
                color="inherit" 
                href={link.url}
                target="_blank" // Opens link in a new tab
                rel="noopener noreferrer" // Security best practice for target="_blank"
                sx={{ mx: 0.5 }}
              >
                {link.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default AppFooter