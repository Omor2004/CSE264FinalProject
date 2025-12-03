import React, { useState, useEffect } from 'react'
import { 
  Container, Typography, Box, Grid, CircularProgress, Alert
} from '@mui/material'
// import { Link } from 'react-router-dom'
import { fetchJikanData } from '../api/jikanApi'
import { createSlug } from '../utils/urlUtils'
import SmallAnimeCard from '../components/SmallAnimeCard'

const MAX_ITEMS_TO_DISPLAY = 20

const CurrentSeasonAnime = () => {
  const [currentSeasonAnime, setCurrentSeasonAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSeasonData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchJikanData('seasons/now', 1) 
        
        if (result.data.length === 0) {
          setError("Could not load current season data or the list is empty.")
        }

        const mappedData = result.data
          .filter(item => item && item.mal_id)
          .slice(0, MAX_ITEMS_TO_DISPLAY)
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
            <Grid 
            key={anime.jikan_id} 
            sx={{ 
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
            }}
            >
              {/* Using the extracted card component. truncateTitle prop removed. */}
              <SmallAnimeCard 
                anime={anime} 
                path={path} 
              />
            </Grid>
          )
        })}
      </Grid>
      
      {currentSeasonAnime.length > 0 && (
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
              Displaying the top {currentSeasonAnime.length} anime airing this season.
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default CurrentSeasonAnime