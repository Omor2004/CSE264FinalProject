import express from 'express'
import sql from './db/postgres.js'
import 'dotenv/config'

// create the app
const app = express()  
// set the port
app.set('port', 3000)
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running')
})

app.get('/users', async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users`
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Request data from a specific user from user table
app.get('/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    const rows = await sql`
      SELECT id, username, fullname, avatar, bio, created_at
      FROM users
      WHERE id = ${id}
    `
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' })
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Add user to users table
app.post('/users', async (req, res) =>{
  const { username, fullname } = req.body
  try {
    const result = await sql`INSERT INTO users (username, fullname) VALUES (${username}, ${fullname}) RETURNING *`
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to add user' })
  }
})

// Update user information in user table
app.put('/users/:id', async (req, res) => {
  const { id } = req.params
  const { username, fullname, avatar, bio } = req.body
  try {
    const result = await sql`
      UPDATE users
      SET username = ${username}, fullname = ${fullname}, avatar = ${avatar}, bio = ${bio}
      WHERE id = ${id}
      RETURNING id, username, fullname, avatar, bio, created_at
    `
    if (result.length === 0) return res.status(404).json({ error: 'User not found' })
    res.json(result[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// Delete user from users table
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING *`
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// Anime list routes

// Get all entries from users_anime_list table
app.get('/users_anime_list', async (req, res) => {
  try {
    const list = await sql`SELECT * FROM users_anime_list`
    res.json(list)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch users anime list' })
  }
})

// Request data from a specific user from users_anime_list table
app.get('/users_anime_list/:user_id', async (req, res) => {
  const { user_id } = req.params
  try {
    const list = await sql`
      SELECT * FROM users_anime_list WHERE user_id = ${user_id}
    `
    if (list.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(list)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch users anime list' })
  }
})

// Add to users_anime_list table
app.post('/users_anime_list/:user_id', async (req, res) => {
  const { user_id } = req.params
  const { anime_id, status, episodes_watched, user_score } = req.body
  try {
    const result = await sql`
      INSERT INTO users_anime_list (user_id, anime_id, status, episodes_watched, user_score)
      VALUES ( ${user_id}, ${anime_id}, ${status}, ${episodes_watched}, ${user_score})
      RETURNING *
    `
    res.status(201).json(result[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to add to users anime list' })
  }
})

// Update users_anime_list table
app.put('/users_anime_list/:user_id', async (req, res) => {
  const { user_id } = req.params
  const { anime_id, status, user_score, episodes_watched } = req.body
  try {
    const result = await sql`
      UPDATE users_anime_list
      SET status = ${status}, user_score = ${user_score}, episodes_watched = ${episodes_watched}
      WHERE user_id = ${user_id} and anime_id = ${req.body.anime_id}
      RETURNING *
    `
    if (result.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(result[0])
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update users anime list' })
  }
})

// Delete from users_anime_list table
app.delete('/users_anime_list/:user_id', async (req, res) => {
  const { user_id } = req.params
  try {
    const result = await sql`DELETE FROM users_anime_list WHERE user_id = ${user_id} RETURNING *`
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete from users anime list' })
  }
})




// to run API, use npm run dev
app.listen(app.get('port'), () => {
    console.log("App is running at http://localhost:3000")
    console.log(" Press CTRL-C to stop \n")
})