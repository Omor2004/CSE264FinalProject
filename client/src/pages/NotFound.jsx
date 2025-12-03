import React from 'react'
import { Box, Typography } from '@mui/material'

const NotFound = () => {
  return (
    <Box sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h1" color="error">
        404
      </Typography>
      <Typography variant="h4" color="text.secondary">
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        The page you are looking for does not exist.
      </Typography>
    </Box>
  )
}

export default NotFound