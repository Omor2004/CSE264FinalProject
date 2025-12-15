import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

import { 
  Container, Typography, Box, CircularProgress, Alert, 
  Grid, Card, CardContent, CardMedia, Chip, List, ListItem, 
  ListItemIcon, ListItemText, Divider, Rating, Button
} from '@mui/material'
import { 
  AccessTime, CalendarToday, LiveTv, Movie, 
  FormatListNumbered, Public, DoneAll, FavoriteBorder, Favorite
} from '@mui/icons-material'
import { fetchJikanData } from '../api/jikanApi'

const AnimeDetail = () => {
  // We only need jikanId to fetch data the slug is ignored here but helps SEO
  const { jikanId } = useParams()
  const { session } = UserAuth() || {}
  const isAuthenticated = Boolean(session?.user)
  const userId = session?.user?.id

  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [listEntry, setListEntry] = useState(null) 
  const isFavorite = listEntry?.is_favorite || false

  // Function to fetch the user's current list status for this anime
  const fetchUserListStatus = async (uid, animeId) => {
    if (!uid) return null
    try {
      const response = await fetch(`http://localhost:3000/users_anime_list/${uid}/${animeId}`)
      if (response.ok) {
        const data = await response.json()
        // should return either the single entry object or an empty array/null
        return Array.isArray(data) && data.length > 0 ? data[0] : null
      }
      return null
    } catch (err) {
      console.error("Failed to fetch user list status:", err)
      return null
    }
  }


  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !userId) {
      return alert("You must be logged in to save favorites.")
    }
    
    // Determine the action: Add/Update (if exists) or Remove
    const newFavoriteStatus = !isFavorite
    
    // Data payload for the server
    const payload = {
      user_id: userId,
      anime_id: jikanId,
      is_favorite: newFavoriteStatus,
      // If it's a new entry, default status and episodes are needed
      status: listEntry?.status || 'Watching', 
      episodes_watched: listEntry?.episodes_watched || 0,
      user_score: listEntry?.user_score || null,
    }

    try {
      // NOTE: You need to create this Express route: POST or PUT /users_anime_list
      const url = `http://localhost:3000/users_anime_list/user_id`
      const method = listEntry ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error(`Failed to ${method} favorite status.`)
      
      // Update local state based on the action
      setListEntry(prev => ({
        ...prev,
        ...payload, 
        // Merge payload data (especially the new is_favorite)
        // If it was a POST (new entry), we get all the data back
        // If it was a PUT, the server might return the updated entry
      }))

    } catch (err) {
      console.error("Favorite toggle error:", err)
    }
  }

  useEffect(() => {
    if (!jikanId) return

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // 1. Fetch Anime Details
      const animeResult = await fetchJikanData(`anime/${jikanId}/full`) 
      if (!animeResult.data || Object.keys(animeResult.data).length === 0) {
          throw new Error("Anime details not found for this ID.")
      }
      setAnime(animeResult.data)

      // 2. Fetch User List Status (Only if authenticated)
      if (isAuthenticated && userId) {
          const status = await fetchUserListStatus(userId, jikanId)
          setListEntry(status)
      }
    } catch (err) {
      setError("Failed to load anime details.")
      console.error("Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }

    fetchData()
  }, [jikanId, isAuthenticated, userId])

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
        {/* Header Section (remains the same) */}
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
                {/* Score and Rating (remains the same) */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                  <Rating 
                    value={anime.score ? parseFloat(anime.score / 2) : 0} 
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
                
                <Divider sx={{ my: 2 }} />
                
                {isAuthenticated && (
                  <Button 
                    variant={isFavorite ? 'contained' : 'outlined'}
                    color="error"
                    startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                    onClick={handleFavoriteToggle}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                )}
  
              </CardContent>
            </Card>
          </Grid>
  
          {/* 2. Details */}
          <Grid size={{ xs: '12', md: '8'}} >
            <Box sx={{ mb: 3 }} >
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