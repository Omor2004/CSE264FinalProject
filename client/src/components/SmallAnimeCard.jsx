import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { createSlug } from '../utils/urlUtils'

// this function manage title "length"
const truncateTitle = (title, limit = 40) => {
  if (!title) return ''
  return title.length > limit ? title.substring(0, limit) + '...' : title
}

const SmallAnimeCard = ({ anime }) => {
  if (!anime || !anime.jikan_id || !anime.title) return null

  const animeSlug = createSlug(anime.title)
  const descriptionPath = `/anime/${anime.jikan_id}/${animeSlug}`

  return (
    <Box
      sx={{
        borderRadius: '8px',
        border: `1px solid #e0e0e0`,
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        gap: '.5rem',
        width: '250px',
        boxSizing: 'border-box',
        boxShadow: 3,
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 8,
        }
      }}
    >
    {/* IMAGE Box */}
      <Box 
        className="image"
        sx={{
          alignItems: 'center',
          display: 'flex',
          maxWidth: '100%',
          justifyContent: 'center',
        }}
      >
        <Box
          component='img'
          src={anime.picture}
          alt={anime.title}
          sx={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            maxHeight: '100px',
            borderRadius: '4px',
          }}
        />
      </Box>

      {/* CONTENT Box */}
      <Box 
        className="content"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          pl: 1,
        }}
      >
        <Box>
          {/* Title */}
          <Link to={descriptionPath} style={{ textDecoration: 'none' }}>
            <Typography 
              variant='h6' 
              component='h2' 
              color= 'primary'
              sx={{ 
                fontWeight: 600, 
                mb: 1,
                fontSize: '1rem'
              }}
            >
              {truncateTitle(anime.title)}
            </Typography>
          </Link>

          {/* Status (Taking the place of the description/secondary text) */}
          <Typography 
            variant='body1' 
            color= '#616161'
            sx={{ mt: 1, mb: 2, fontSize: '1rem'}}
          >
            Status: <strong>{anime.status}</strong>
          </Typography>
        </Box>
          
        <Box sx={{ mt: 'auto' }}>
          <Typography variant='body1' color='text.secondary' sx={{ fontSize: '1rem' }}>
            Episodes: {anime.episodes}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SmallAnimeCard