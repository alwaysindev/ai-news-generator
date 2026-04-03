#!/usr/bin/env node

/**
 * Script para ejecutar como cron job y actualizar noticias automáticamente
 * 
 * Uso en crontab:
 * 0 9 * * * /usr/bin/node /path/to/scripts/extractNews.js
 * (Ejecuta diariamente a las 9:00 AM)
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY

async function refreshNews() {
  try {
    console.log(`[${new Date().toISOString()}] Starting news refresh...`)

    if (!INTERNAL_API_KEY) {
      console.error('Error: INTERNAL_API_KEY not set in .env.local')
      process.exit(1)
    }

    const response = await fetch(`${API_URL}/api/refresh-news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INTERNAL_API_KEY,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${result.error}`)
    }

    console.log(`[${new Date().toISOString()}] ✅ News refresh completed`)
    console.log(result)
    process.exit(0)
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error refreshing news:`)
    console.error(error)
    process.exit(1)
  }
}

refreshNews()
