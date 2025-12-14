import React, { useState, useEffect, useMemo } from 'react'
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
import { UserAuth } from '../context/AuthContext'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import SmallAnimeCard from '../components/pfpAnimeCard'


const ProfilePage = () => {
  const { id } = useParams()
  const { session } = UserAuth() 
  const authenticatedUserId = session?.user?.id //theUUID of the logged-in user
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // NEW: anime list state
  const [animeList, setAnimeList] = useState([])
  const [listLoading, setListLoading] = useState(true)

  useEffect(() => {
    const routeUserId = id || authenticatedUserId
    //when no ID is found
    if (!routeUserId) { 
      setLoading(false)
      setUser(null)
      return
  }
    const controller = new AbortController()

    // Load user first
    fetch(`http://localhost:3000/users/${routeUserId}`, { signal: controller.signal })
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
  }, [id, authenticatedUserId])

  // Load anime list after user is known (uses user.id which is a uuid in your table)
  useEffect(() => {
    if (!user?.id) return
    const controller = new AbortController()
    setListLoading(true)

    fetch(`http://localhost:3000/users_anime_list/${user.id}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load anime list')
        return res.json()
      })
      .then(async (list) => {
        const rows = Array.isArray(list) ? list : []

        // Fetch Jikan details in parallel for items that have anime_id
        const enriched = await Promise.all(
          rows.map(async (row) => {
            const jikanId = row.anime_id
            let details = null
            if (jikanId) {
              try {
                const r = await fetch(`https://api.jikan.moe/v4/anime/${jikanId}`)
                const d = await r.json()
                details = d?.data || null
              } catch (e) {
                console.warn('Jikan fetch failed for', jikanId, e)
              }
            }

            return {
              jikan_id: jikanId,
              title: details?.title || details?.title_english || details?.title_japanese || 'Untitled',
              picture: details?.images?.jpg?.image_url || details?.images?.webp?.image_url || '',
              status: row.status || 'Unknown',
              episodes: row.episodes_watched ?? 0,
              user_score: row.user_score ?? null,
              user_id: row.user_id,
            }
          })
        )

        setAnimeList(enriched)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })
      .finally(() => setListLoading(false))

    return () => controller.abort()
  }, [user])

  // Sort list: score high->low, then id high->low
  const sortedAnimeList = useMemo(() => {
    return [...animeList].sort((a, b) => {
      const scoreA = a.user_score ?? -Infinity
      const scoreB = b.user_score ?? -Infinity
      if (scoreA !== scoreB) return scoreB - scoreA
      const idA = Number(a.jikan_id ?? a.anime_id ?? 0)
      const idB = Number(b.jikan_id ?? b.anime_id ?? 0)
      return idB - idA
    })
  }, [animeList])

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

      {/* Bottom section with anime cards */}
      <Card sx={{ mt: 2, borderRadius: 3 }}>
        <Card sx={{ boxShadow: 0 }}>
          <Typography variant="h6" sx={{ px: 2, pt: 2 }}>{p?.name}'s Top Anime</Typography>
        </Card>
        <Divider />
        <Card sx={{ boxShadow: 0, p: 2 }}>
          {listLoading ? (
            <Typography variant="body2" color="text.secondary">Loading list…</Typography>
          ) : sortedAnimeList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No entries yet.</Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                  xl: 'repeat(5, 1fr)',
                },
              }}
            >
              {/* limit to top 10 and pass rank */}
              {sortedAnimeList.slice(0, 10).map((item, idx) => (
                <SmallAnimeCard
                  key={`${item.user_id}-${item.jikan_id ?? item.anime_id ?? Math.random()}`}
                  anime={item}
                  rank={idx + 1}
                />
              ))}
            </Box>
          )}
        </Card>
      </Card>
    </Container>
  )
}

export default ProfilePage