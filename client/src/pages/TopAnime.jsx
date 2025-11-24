import React from 'react'
import { Container, Typography, Box, CircularProgress} from '@mui/material'
import { useAnimeData } from '../hooks/animeData'
import AnimeCard from '../components/AnimeCard'

const TopAnime = () => {
  const { publicAnime, publicLoading } = useAnimeData()

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
        Top 10 Rated Anime
      </Typography>

      {publicLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>

      ) : (

        <Box
          className="cta"
          sx={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
        >
          {publicAnime.map((anime) => (
            <Box key={anime.jikan_id} sx={{ display: 'contents' }}>
              <AnimeCard anime={anime} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  )
}

export default TopAnime