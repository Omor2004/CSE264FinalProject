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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import SmallAnimeCard from '../components/pfpAnimeCard'
import { UserAuth } from '../context/AuthContext'

const ProfilePage = () => {
  const { id } = useParams()
  const { session } = UserAuth()
  const authenticatedUserId = session?.user?.id // UUID of the logged‑in user

  // Profile state and status flags
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Anime list state and status flags
  const [animeList, setAnimeList] = useState([])
  const [listLoading, setListLoading] = useState(true)

  // Edit profile dialog state
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    fullname: '',
    username: '',
    bio: '',
    avatar: '',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Track current (logged-in) user
  const [currentUser, setCurrentUser] = useState(null)

  // Fetch the user to display
  useEffect(() => {
    const routeUserId = id || authenticatedUserId
    if (!routeUserId) {
      setLoading(false)
      setUser(null)
      return
    }
    const controller = new AbortController()

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

  // Load the logged-in user's record (for paid flag and edit visibility parity)
  useEffect(() => {
    if (!session?.user?.id) return
    const controller = new AbortController()

    fetch(`http://localhost:3000/users/${session.user.id}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load current user')
        return res.json()
      })
      .then((data) => setCurrentUser(data))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Error loading current user:', err)
      })

    return () => controller.abort()
  }, [session?.user?.id])

  // Load anime list after user is known
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
              title:
                details?.title ||
                details?.title_english ||
                details?.title_japanese ||
                'Untitled',
              picture:
                details?.images?.jpg?.image_url ||
                details?.images?.webp?.image_url ||
                '',
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

  // Derived list: sort by score (desc), then by id (desc)
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

  // Presentation model
  const p = user
    ? {
        name: user.fullname || user.username,
        handle: user.username,
        bio: user.bio || '',
        avatarUrl: user.avatar || '',
      }
    : null

  // Seed the edit form
  useEffect(() => {
    if (user) {
      setForm({
        fullname: user.fullname || '',
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      })
    }
  }, [user])

  // Edit dialog handlers
  const handleOpenEdit = () => setEditOpen(true)
  const handleCloseEdit = () => {
    setEditOpen(false)
    setSaveError(null)
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Persist edits
  const handleSave = async () => {
    if (!user?.id) return
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: form.fullname,
          username: form.username,
          bio: form.bio,
          avatar: form.avatar,
          paid: user.paid,
        }),
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => '')
        throw new Error(msg || `Failed to save (${res.status})`)
      }
      const updated = await res.json()
      setUser(updated)
      setEditOpen(false)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Render
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Left ads: show only if logged-in viewer is NOT paid */}
      {currentUser && currentUser?.paid === false && (
        <Box sx={{ width: 200, mr: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <img src="data:image/jpeg;base64,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" alt="Ad 3" style={{ width: '100%', height: 'auto' }} />
        </Box>
      )}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Profile header */}
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
                {/* Only show to the owner of the profile */}
                {authenticatedUserId === user?.id && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<EditOutlinedIcon />}
                    onClick={handleOpenEdit}
                  >
                    Edit profile
                  </Button>
                )}
                
              </Stack>
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Bio
            </Typography>
            <Typography variant="body1">
              {loading ? 'Loading profile…' : error ? 'Failed to load bio.' : p?.bio || 'No bio yet.'}
            </Typography>
          </Paper>
        </Stack>

        {/* Edit Profile Dialog */}
        <Dialog open={editOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Full name"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Avatar URL"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={3}
              />
              {saveError && (
                <Typography variant="body2" color="error">
                  {saveError}
                </Typography>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} variant="contained" color="primary" disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bottom section: user's Top Anime list */}
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
      {/* Right ads: show only if logged-in viewer is NOT paid */}
      {currentUser && currentUser?.paid === false && (
        <Box sx={{ width: 200, ml: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <img src="data:image/jpeg;base64,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" alt="Ad 3" style={{ width: '100%', height: 'auto' }} />
        </Box>
      )}
    </Box>
  )
}

export default ProfilePage