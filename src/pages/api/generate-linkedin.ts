import type { NextApiRequest, NextApiResponse } from 'next'
import { generateLinkedInPost } from '@/lib/openai'
import { saveGeneratedContent } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { articleId, title, description, category, source } = req.body

    if (!title || !description) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const linkedInPost = await generateLinkedInPost(
      title,
      description,
      category,
      source
    )

    if (!linkedInPost) {
      return res.status(500).json({ error: 'Failed to generate LinkedIn post' })
    }

    // Guardar en base de datos
    if (articleId) {
      await saveGeneratedContent({
        id: `${articleId}-linkedin-${Date.now()}`,
        articleId,
        type: 'linkedin',
        content: JSON.stringify(linkedInPost),
        createdAt: new Date().toISOString(),
      })
    }

    res.status(200).json(linkedInPost)
  } catch (error) {
    console.error('Error in /api/generate-linkedin:', error)
    res.status(500).json({ error: 'Failed to generate LinkedIn post' })
  }
}
