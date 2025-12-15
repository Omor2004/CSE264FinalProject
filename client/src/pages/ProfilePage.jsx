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
import { UserAuth } from '../context/AuthContext'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import SmallAnimeCard from '../components/pfpAnimeCard'


const ProfilePage = () => {
  const { id } = useParams()
  const { session } = UserAuth() 
  const authenticatedUserId = session?.user?.id // UUID of the logged‑in user (from auth context)

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
    website: '',
    avatar: '',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Fetch the user to display:
  // Prefer a route id (e.g., /profile/:id). If missing, fall back to the logged‑in user's UUID.
  useEffect(() => {
    const routeUserId = id || authenticatedUserId
    if (!routeUserId) {
      // No usable id → stop loading and show nothing
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
      .then((data) => setUser(data)) // hydrate profile state
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [id, authenticatedUserId])

  // After the user loads (requires user.id), fetch their anime list from the API,
  // then enrich each entry with title/image from Jikan using anime_id.
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

        // Enrich each DB row with display data from Jikan (title, poster)
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

  // Derived list: sort by score (desc), then by id (desc) when scores tie.
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

  // Presentation model for profile header (handle loading/missing fields gracefully)
  const p = user
    ? {
        name: user.fullname || user.username,
        handle: user.username,
        bio: user.bio || '',
        website: user.website || '',
        avatarUrl: user.avatar || '',
      }
    : null

  // Seed the edit form when the user loads so the dialog shows current values
  useEffect(() => {
    if (user) {
      setForm({
        fullname: user.fullname || '',
        username: user.username || '',
        bio: user.bio || '',
        website: user.website || '',
        avatar: user.avatar || '',
      })
    }
  }, [user])

  // Edit dialog: open/close/save handlers
  const handleOpenEdit = () => setEditOpen(true)
  const handleCloseEdit = () => {
    setEditOpen(false)
    setSaveError(null)
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Persist edits to the API, update local user state on success
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
          website: form.website,
          avatar: form.avatar,
        }),
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => '')
        throw new Error(msg || `Failed to save (${res.status})`)
      }
      const updated = await res.json()
      setUser(updated) // reflect changes immediately in the UI
      setEditOpen(false)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Profile header: avatar + name/handle + website + bio + edit button */}
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
              {/* Name or loading/error message */}
              <Typography variant="h5">
                {loading ? 'Loading…' : error ? 'Error loading user' : p?.name}
              </Typography>
              {/* Handle displayed only when user is ready and no error */}
              {!loading && !error && (
                <Typography variant="body2" color="text.secondary">
                  @{p?.handle}
                </Typography>
              )}
            </Box>
            <Stack direction="row" spacing={1}>
              {/* Opens the edit dialog */}
              <Button
                size="small"
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                onClick={handleOpenEdit}
              >
                Edit profile
              </Button>
              {/* Website icon shown only if website exists */}
              {p?.website && (
                <IconButton color="primary" size="small" aria-label="website">
                  <LinkOutlinedIcon />
                </IconButton>
              )}
            </Stack>
          </Stack>

          {/* Website row (location was intentionally removed) */}
          {!loading && !error && p?.website && (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <LinkOutlinedIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {p.website}
              </Typography>
            </Stack>
          )}

          {/* Bio section */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
            Bio
          </Typography>
          <Typography variant="body1">
            {loading ? 'Loading profile…' : error ? 'Failed to load bio.' : p?.bio || 'No bio yet.'}
          </Typography>
        </Paper>
      </Stack>

      {/* Edit Profile Dialog (modal) */}
      <Dialog open={editOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Controlled inputs bound to `form` state */}
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
              label="Website"
              name="website"
              value={form.website}
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
            {/* Display server error if save failed */}
            {saveError && (
              <Typography variant="body2" color="error">
                {saveError}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bottom section: user's Top Anime list */}
      <Card sx={{ mt: 2, borderRadius: 3 }}>
        <Card sx={{ boxShadow: 0 }}>
          {/* Title uses the user's name if available */}
          <Typography variant="h6" sx={{ px: 2, pt: 2 }}>{p?.name}'s Top Anime</Typography>
        </Card>
        <Divider />
        <Card sx={{ boxShadow: 0, p: 2 }}>
          {/* Loading/empty states for the list */}
          {listLoading ? (
            <Typography variant="body2" color="text.secondary">Loading list…</Typography>
          ) : sortedAnimeList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No entries yet.</Typography>
          ) : (
            // Responsive 1→5 columns grid (5 on xl screens)
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
              {/* Render top 10 ranked items; pass rank for badges */}
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