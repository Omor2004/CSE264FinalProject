import React, { useState, useMemo, useEffect } from 'react'
import { Container, Typography, Box, Grid, CircularProgress, TextField } from '@mui/material'
import { useAnimeData } from '../hooks/animeData'
import { useDebounce } from '../hooks/useDebounce'
import { fetchJikanData } from '../api/jikanApi'
import { Link } from 'react-router-dom'
import { createSlug } from '../utils/urlUtils'

const AnimeCatalog = () => {
  const { publicAnime, publicLoading } = useAnimeData() 
  
  const [searchTerm, setSearchTerm] = useState('')
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500) 
  
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  // --- Search API Effect ---
  useEffect(() => {
    // 1. Skip search if the debounced term is empty
    if (!debouncedSearchTerm) {
      setSearchResults([])
      return
    }

    // Initialize AbortController to handle race conditions and cleanup
    const abortController = new AbortController()
    const signal = abortController.signal

    const performSearch = async () => {
      setSearchLoading(true)
      setSearchResults([])
      try {
        // Build the query endpoint: 'anime?q=term'
        const endpoint = `anime?q=${debouncedSearchTerm}`
        
        // Pass the AbortSignal to the API function
        const result = await fetchJikanData(endpoint, 1, signal) 
        
        // Check if the request was aborted before processing
        if (signal.aborted) return

        // Map data safely before setting state
        const mappedData = result.data
          .filter(item => item && item.mal_id)
          .map(item => ({
            jikan_id: item.mal_id,
            title: item.title,
            rating: item.score || 'N/A',
            picture: item.images?.webp?.image_url || item.images?.jpg?.image_url,
            description: item.synopsis ? item.synopsis.substring(0, 150) + '...' : 'No summary available.',
            type: item.type,
          }))
        setSearchResults(mappedData)

      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Jikan API search failed:", error)
          setSearchResults([])
        }
      } finally {
        // Only set loading to false if the request was NOT aborted
        if (!signal.aborted) {
          setSearchLoading(false)
        }
      }
    }

    performSearch()

    // Cleanup function: Abort the fetch request if the debounced term changes
    // or the component unmounts. This is crucial for preventing race conditions.
    return () => abortController.abort()

  }, [debouncedSearchTerm]) // Only re-run when the debounced term changes

  // --- Combined Data & Sorting Logic ---
  const finalAnimeList = useMemo(() => {
    // If we have an active search term, use the search results
    const listToDisplay = debouncedSearchTerm ? searchResults : publicAnime
    
    // Always sort the list (whether it's publicAnime or searchResults)
    return listToDisplay.slice().sort((a, b) => {
      // Use optional chaining for safe access to title
      const titleA = a.title?.toUpperCase() || ''
      const titleB = b.title?.toUpperCase() || ''
      
      if (titleA < titleB) return -1
      if (titleA > titleB) return 1
      return 0
    })
  }, [publicAnime, debouncedSearchTerm, searchResults]) // Dependencies updated

  if (publicLoading || searchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2, color: 'text.secondary' }}>
            {searchLoading ? "Searching the Jikan database..." : "Loading public catalog..."}
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
      <Typography variant="h4" gutterBottom>
        Anime Catalog
      </Typography>

      <TextField
        label="Search the ENTIRE Anime Database"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={3}>
        {finalAnimeList.length > 0 ? (
          finalAnimeList.map(anime => { 
            const animeSlug = createSlug(anime.title)
            const path = `/anime/${anime.jikan_id}/${animeSlug}`
            return (
              <Grid 
                item 
                key={anime.jikan_id} 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3}
              >
                <Typography 
                  variant="subtitle1" 
                  component={Link}
                  to={path}
                  sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 'bold' }}
                >
                  {anime.title}
                </Typography>
              </Grid>

            )
          })
        ) : (
          <Typography sx={{ mt: 2, ml: 3 }} color="text.secondary">
            {/* Display relevant message based on state */}
            {debouncedSearchTerm 
              ? `No results found for "${debouncedSearchTerm}"` 
              : "No anime loaded in the public catalog."
            }
          </Typography>
        )}
      </Grid>
      
      {/* Show the public catalog count only if no search is active */}
      {!debouncedSearchTerm && publicAnime.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                  Showing {publicAnime.length} items from your catalog.
              </Typography>
          </Box>
      )}
    </Container>
  )
}

export default AnimeCatalog