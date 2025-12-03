import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Container,
  Stack,
  Avatar,
  Typography,
  Button,
  IconButton,
  Card,
  Divider,
  Paper,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'


const ProfilePage = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const userId = id ?? '1' // fallback if route param not present
    const controller = new AbortController()

    fetch(`http://localhost:3000/users/${userId}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load user')
        return res.json()
      })
      .then((data) => setUser(data))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [id])

  const p = user
    ? {
        name: user.fullname || user.username,
        handle: user.username,
        bio: user.bio || '',
        website: user.website || '',
        avatarUrl: user.avatar || '',
      }
    : null

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Top Section(profile pic +username + bio) */}
      <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ px: 2, mt: 2 }}>
        <Avatar
          src={p?.avatarUrl || ''}
          alt={`${p?.name || 'user'} avatar`}
          sx={{
            width: 104,
            height: 104,
            border: '4px solid',
            borderColor: 'background.paper',
            boxShadow: 3,
          }}
        />

        <Paper elevation={3} sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h5">
                {loading ? 'Loading…' : error ? 'Error loading user' : p?.name}
              </Typography>
              {!loading && !error && (
                <Typography variant="body2" color="text.secondary">
                  @{p?.handle}
                </Typography>
              )}
            </Box>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" startIcon={<EditOutlinedIcon />}>
                Edit profile
              </Button>
              {p?.website && (
                <IconButton color="primary" size="small" aria-label="website">
                  <LinkOutlinedIcon />
                </IconButton>
              )}
            </Stack>
          </Stack>

          {/* Website only (location removed) */}
          {!loading && !error && p?.website && (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <LinkOutlinedIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {p.website}
              </Typography>
            </Stack>
          )}

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
            Bio
          </Typography>
          <Typography variant="body1">
            {loading ? 'Loading profile…' : error ? 'Failed to load bio.' : p?.bio || 'No bio yet.'}
          </Typography>
        </Paper>
      </Stack>

      {/* Bottom section container only (kept empty) */}
      <Card sx={{ mt: 2, borderRadius: 3, minHeight: 160 }} />
    </Container>
  )
}

export default ProfilePage