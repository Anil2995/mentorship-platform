import { Client } from 'pg'
import fs from 'fs'
import path from 'path'

// Using URL encoding because the password contains an '@' symbol
const dbPassword = encodeURIComponent('Anilkumar@2005');

// For Supabase, direct IPv6 connection or IPv4 connection fallback
const connectionString = `postgresql://postgres:${dbPassword}@db.flcmjihcchdlwuopdotn.supabase.co:5432/postgres`;

const client = new Client({ connectionString })

async function runSQL() {
  console.log('Connecting to Supabase Database...')
  try {
    await client.connect()
    console.log('Connected natively! Reading migration schema...')
    
    // Path relative to backend script
    const sqlPath = path.resolve(process.cwd(), '../database_setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('Deploying schema to Supabase...')
    await client.query(sql)
    
    console.log('SUCCESS: Database deployed completely!')
    process.exit(0)
  } catch (err) {
    console.error('Failed to deploy schema. Detail:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runSQL()
