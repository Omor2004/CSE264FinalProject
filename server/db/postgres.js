import postgres from 'postgres'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

async function testConnection() {
  try {
    await sql`SELECT 1`
    console.log('✅ Database connection successful!')
  } catch (err) {
    console.error('❌ Database connection failed:')
    console.error(err)
  }
}

testConnection()

export default sql