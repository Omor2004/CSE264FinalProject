import React from 'react'
import { AddBox, Star, Info } from '@mui/icons-material'
import { 
    Typography, Box, Card, CardContent, CardMedia, Button, IconButton, useTheme, Tooltip
} from '@mui/material'

// /**
//  * A reusable component for displaying public anime data with an 'Add to List' action.
//  * * @param {object} anime - The anime data object (from Jikan API).
//  * @param {function} isItemInList - Checks if the item is already in the user's list.
//  * @param {function} addItemToList - Adds the item to the user's Supabase list.
//  * @param {boolean} isAuthenticated - Whether the user is logged in.
//  */

const AnimeCardComponent = ({ anime, isItemInList, addItemToList, isAuthenticated }) => {
  const theme = useTheme()
  const isAdded = isItemInList(anime.jikan_id) 

  const handleAdd = async () => {
    if (!isAuthenticated) {
      console.error("Authentication required to add item.")
      return
    }

    const result = await addItemToList(anime)
    if (result.error) {
      console.error(`Failed to add: ${result.error}`)
    }
  }

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        boxShadow: theme.shadows[3],
        borderRadius: 2,
        transition: '0.3s',
        '&:hover': { 
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)'
        },
        width: '100%' 
      }}
    >
      <Box sx={{ 
        position: 'relative',
        flexShrink: 0,
        width: { xs: '100%', sm: 160 },
        height: { xs: 200, sm: 'auto' },
      }}>
        <CardMedia
          component="img"
          mage={anime.picture || "https://placehold.co/400x250/cccccc/333333?text=No+Image"}
          alt={anime.title}
          x={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/cccccc/333333?text=Image+Missing" }}
        />
          <Box sx={{ 
            position: 'absolute', top: 8, left: 8, 
            bgcolor: 'rgba(0, 0, 0, 0.7)', color: 'white', 
            px: 1, py: 0.5, borderRadius: 1, 
            display: 'flex', alignItems: 'center'
          }}>
            <Star sx={{ fontSize: 14, color: '#FFD700', mr: 0.5 }} />
            <Typography variant="caption" fontWeight="bold">
              {anime.rating}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
          <Box>
            <Typography variant="h6" component="h2" gutterBottom 
              sx={{ fontWeight: 700, color: theme.palette.primary.main, lineHeight: 1.2 }}
            >
              {anime.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" 
              sx={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                minHeight: '3.5em' 
              }}
            >
              {anime.description}
            </Typography>
          </Box>
            
          <Box sx={{ 
            pt: 2, 
            mt: 1, 
            borderTop: `1px solid ${theme.palette.divider}`, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
              <Button 
                size="small"
                startIcon={<Info />}
                color="secondary"
                sx={{ textTransform: 'none' }}
              >
                Details
              </Button>
              
              <Tooltip title={isAdded ? "Already in My List" : "Add to My List"}>
                <IconButton 
                  onClick={handleAdd}
                  disabled={isAdded}
                  color={isAdded ? 'success' : 'primary'}
                  size="large"
                  sx={{
                      transition: 'transform 0.2s',
                      '&:hover:not(:disabled)': { transform: 'scale(1.05)' }
                  }}
                >
                  <AddBox />
                </IconButton>
              </Tooltip>
          </Box>
        </CardContent>
    </Card>
  )
}

export default AnimeCardComponent