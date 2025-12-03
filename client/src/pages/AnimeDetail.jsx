import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Container, Typography, Box, CircularProgress, Alert, 
  Grid, Card, CardContent, CardMedia, Chip, List, ListItem, 
  ListItemIcon, ListItemText, Divider, Rating
} from '@mui/material'
import { 
  AccessTime, CalendarToday, LiveTv, Movie, 
  FormatListNumbered, Public, DoneAll 
} from '@mui/icons-material'
import { fetchJikanData } from '../api/jikanApi'

const AnimeDetail = () => {
  // We only need jikanId to fetch data the slug is ignored here but helps SEO
  const { jikanId } = useParams() 

  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!jikanId) return

  const fetchDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const endpoint = `anime/${jikanId}/full`
      
      const result = await fetchJikanData(endpoint) 

      if (result.data && Object.keys(result.data).length > 0) {
          setAnime(result.data)
      } else {
          // Check if the API returned an empty object/array when it should have data
          setError("Anime details not found for this ID.")
      }

    } catch (err) {
      setError("Failed to load anime details.")
      console.error("Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }

    fetchDetails()
  }, [jikanId])

  // --- Loading and Error States ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !anime) {
    return (
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Alert severity="error">{error || "Could not load anime details."}</Alert>
      </Container>
    )
  }

  // --- Helper for creating detail list items ---
  const detailList = [
    { icon: <LiveTv color="primary" />, primary: 'Status', secondary: anime.status || 'N/A' },
    { icon: <FormatListNumbered color="primary" />, primary: 'Episodes', secondary: anime.episodes || 'N/A' },
    { icon: <AccessTime color="primary" />, primary: 'Duration', secondary: anime.duration || 'N/A' },
    { icon: <CalendarToday color="primary" />, primary: 'Aired', secondary: anime.aired?.string || 'N/A' },
    { icon: <Movie color="primary" />, primary: 'Type', secondary: anime.type || 'N/A' },
    { icon: <Public color="primary" />, primary: 'Source', secondary: anime.source || 'N/A' },
    { icon: <DoneAll color="primary" />, primary: 'Producers', secondary: anime.producers?.map(p => p.name).join(', ') || 'N/A' },
  ].filter(item => item.secondary !== 'N/A' && item.secondary !== '')

    // --- Main Content Display ---
  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
      {/* Header Section */}
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        {anime.title}
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {anime.title_japanese}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={4}>
        {/* 1. Image and Score (Left Column) */}
        <Grid size={{xs: '10', md: '4' }}>
          <Card raised>
            <CardMedia
              component="img"
              image={anime.images?.webp?.image_url || anime.images?.jpg?.image_url} 
              alt={anime.title}
              sx={{ height: 400, objectFit: 'cover' }}
            />
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                {/* Note: MUI Rating component typically uses the 'value' prop for score */}
                <Rating 
                  value={anime.score ? parseFloat(anime.score / 2) : 0} // Convert 10-point score to 5-star rating
                  precision={0.5} 
                  readOnly 
                  sx={{ mr: 1 }} 
                />
                <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
                  {anime.score || 'N/A'}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Ranked #{anime.rank || 'N/A'} | Popularity #{anime.popularity || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 2. Details and Synopsis (Right Column) */}
        <Grid size={{ xs: '12', md: '8'}} >
          {/* Genres Chips */}
          <Box sx={{ mb: 3 }}>
            {anime.genres?.map((genre) => (
              <Chip 
                key={genre.mal_id} 
                label={genre.name} 
                size="small" 
                color="secondary" 
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>

          {/* Quick Details List */}
          <List dense>
            {detailList.map((item, index) => (
              <ListItem key={index} disableGutters>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.primary} 
                  secondary={item.secondary} 
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>


      <Divider sx={{ my: 3 }} />

      {/* Synopsis */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Synopsis
      </Typography>
      <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
          {anime.synopsis || "No detailed synopsis available."}
      </Typography>
      
      {/* Themes */}
      {anime.themes && anime.themes.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Themes:</Typography>
          {anime.themes.map((theme) => (
            <Chip 
              key={theme.mal_id} 
              label={theme.name} 
              variant="outlined"
              size="small" 
              sx={{ mr: 1, mt: 1 }}
            />
          ))}
        </Box>
      )}
    </Container>
  )
}

export default AnimeDetail