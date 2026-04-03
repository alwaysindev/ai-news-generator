import type { NextApiRequest, NextApiResponse } from 'next'
import { getArticles } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { category, limit = 50 } = req.query

    const articles = await getArticles(
      category as string | undefined,
      parseInt(limit as string) || 50
    )

    res.status(200).json(articles)
  } catch (error) {
    console.error('Error in /api/articles:', error)
    res.status(500).json({ error: 'Failed to fetch articles' })
  }
}
