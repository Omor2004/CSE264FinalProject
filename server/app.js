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

app.get('/usersAnimeList', async (req, res) => {
  try {
    const userAnimeList = await sql`SELECT * FROM users_anime_list`
    res.json(userAnimeList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch users anime list' })
  }
})

// to run API, use npm run dev
app.listen(app.get('port'), () => {
    console.log("App is running at http://localhost:3000")
    console.log(" Press CTRL-C to stop \n")
})