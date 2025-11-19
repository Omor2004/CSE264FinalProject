import express from 'express'
import sql from './db/postgres.js'
import 'dotenv/config'

// create the app
const app = express()  
// set the port
app.set('port', 3000)

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

// Request data from a specific user
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

// Add user to to users table
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

// Update user information
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



// to run API, use npm run dev
app.listen(app.get('port'), () => {
    console.log("App is running at http://localhost:3000")
    console.log(" Press CTRL-C to stop \n")
})