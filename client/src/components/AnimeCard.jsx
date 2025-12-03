import React from 'react'
import { Box, Typography, Button, useTheme } from '@mui/material'

const AnimeCard = ({ anime }) => {
  const theme = useTheme()

  const teamColor = theme.palette.primary.main 

  return (
    <Box 
      sx={{
        borderRadius: '8px',
        border: `1px solid ${theme.palette.grey[300]}`,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: '1rem',
        gap: '1rem',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box 
        className="image"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flex: '1 0 200px',
          justifyContent: 'center',
        }}
      >
        <img 
          src={anime.picture} 
          alt={anime.title} 
          style={{ 
            width: '100%', 
            height: 'auto',
            maxHeight: '250px',
            borderRadius: '4px',
            objectFit: 'cover'
          }}
        />
      </Box>

      <Box 
        className="content"
        sx={{
          display: 'flex',
          flex: '1 0 50%',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" sx={{ color: teamColor, fontWeight: 600, mb: 1 }}>
            {anime.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Rating: {anime.rating} / Type: {anime.type}
          </Typography>
          <Typography variant="body2" sx={{ margin: 0 }}>
            {anime.description}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button size="small" variant="contained" color="primary">
              Details
          </Button>
        </Box>

      </Box>
    </Box>
  )
}

export default AnimeCard