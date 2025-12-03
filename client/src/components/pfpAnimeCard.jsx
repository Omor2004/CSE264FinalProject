import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const createSlug = (title = '') =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const truncateTitle = (title = '', limit = 60) =>
  title.length > limit ? title.substring(0, limit) + '...' : title

const SmallAnimeCard = ({ anime, rank }) => {
  if (!anime) return null

  const hasRoute = anime.jikan_id && anime.title
  const slug = createSlug(anime.title || '')
  const href = hasRoute ? `/anime/${anime.jikan_id}/${slug}` : '#'

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: theme => `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 'unset',
        overflow: 'hidden',
        boxShadow: 3,
        bgcolor: 'background.paper',
        position: 'relative',               // enable overlay
      }}
    >
      {/* Rank badge */}
      {rank && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            boxShadow: 2,
            zIndex: 1,
          }}
        >
          {rank}
        </Box>
      )}

      {/* Image area */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 180, sm: 200 },
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
        }}
      >
        <Box
          component="img"
          src={anime.picture || ''}
          alt={anime.title || 'Anime'}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </Box>

      <Box sx={{ p: 1.25 }}>
        {hasRoute ? (
          <Link to={href} style={{ textDecoration: 'none' }}>
            <Typography color="text.primary" variant="subtitle1" sx={{ fontWeight: 700 }}>
              {truncateTitle(anime.title)}
            </Typography>
          </Link>
        ) : (
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {truncateTitle(anime.title || 'Untitled')}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
          Status: {anime.status || 'Unknown'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
          Last Episode Watched: {anime.episodes ?? 0}
        </Typography>
        {anime.user_score != null && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
            Score: {anime.user_score}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default SmallAnimeCard