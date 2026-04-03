import type { NextApiRequest, NextApiResponse } from 'next'
import { generateReelScript } from '@/lib/openai'
import { saveGeneratedContent } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { articleId, title, description, category } = req.body

    if (!title || !description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const reelScript = await generateReelScript(title, description, category)

    if (!reelScript) {
      return res.status(500).json({ error: 'Failed to generate reel script' })
    }

    // Guardar en base de datos
    if (articleId) {
      await saveGeneratedContent({
        id: `${articleId}-reel-${Date.now()}`,
        articleId,
        type: 'reel',
        content: JSON.stringify(reelScript),
        createdAt: new Date().toISOString(),
      })
    }

    res.status(200).json(reelScript)
  } catch (error) {
    console.error('Error in /api/generate-reel:', error)
    res.status(500).json({ error: 'Failed to generate reel' })
  }
}
