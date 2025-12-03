import React, { useState, useEffect } from 'react'
import { 
  Container, Typography, Box, Grid, CircularProgress, Alert
} from '@mui/material'
import { Link } from 'react-router-dom'
import { fetchJikanData } from '../api/jikanApi'
import { createSlug } from '../utils/urlUtils'

const MAX_ITEMS_TO_DISPLAY = 20

const CurrentSeasonAnime = () => {
  const [currentSeasonAnime, setCurrentSeasonAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const truncateTitle = (title, limit = 40) => {
    if (!title) return '';
    return title.length > limit ? title.substring(0, limit) + '...' : title
  }

  useEffect(() => {
    const fetchSeasonData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchJikanData('seasons/now', 1) 
        
        if (result.data.length === 0) {
          setError("Could not load current season data or the list is empty.")
        }

        // Map data to a consistent structure
        const mappedData = result.data
          .filter(item => item && item.mal_id)
          .slice(0, MAX_ITEMS_TO_DISPLAY) // Limit display size for clean initial view
          .map(item => ({
            jikan_id: item.mal_id,
            title: item.title,
            score: item.score || 'N/A',
            episodes: item.episodes || 'Unknown',
            status: item.status,
            picture: item.images?.webp?.image_url || 'https://placehold.co/225x318/cccccc/333333?text=No+Image',
          }))
          
        setCurrentSeasonAnime(mappedData)

      } catch (err) {
        console.error("Error fetching current season anime:", err)
        setError("Failed to load data from Jikan API.")
      } finally {
        setLoading(false)
      }
    }

    fetchSeasonData()
  }, [])


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading current season's anime...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
        Anime Airing This Season
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {currentSeasonAnime.map((anime) => {
          const animeSlug = createSlug(anime.title)
          const path = `/anime/${anime.jikan_id}/${animeSlug}`
          
          return (
            // Grid Item adjusted for wider card layout
            <Grid 
              key={anime.jikan_id} 
              sx={{ 
                display: 'grid',
                gap: '2rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
              }}
            >
              {/* START of new Card structure based on user's request */}
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
                    <Link to={path} style={{ textDecoration: 'none' }}>
                      <Typography 
                        variant='h6' 
                        component='h2' 
                        sx={{ 
                          color: '#0d47a1',
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
                      color= '#616161' // Gray text
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
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

export default CurrentSeasonAnime