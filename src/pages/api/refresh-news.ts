import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchAllNews } from '@/lib/scraper'
import { upsertArticle, deleteOldArticles } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validar que sea POST (para evitar actualizaciones accidentales por GET)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verificar API key simple (en producción usa algo más seguro)
    const apiKey = req.headers['x-api-key']
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Obtener todas las noticias
    const articles = await fetchAllNews()

    if (articles.length === 0) {
      return res.status(200).json({ message: 'No new articles found' })
    }

    // Guardar cada artículo en BD
    let savedCount = 0
    for (const article of articles) {
      const success = await upsertArticle(article)
      if (success) savedCount++
    }

    // Limpiar artículos viejos (> 30 días)
    await deleteOldArticles(30)

    res.status(200).json({
      message: 'News updated successfully',
      articlesProcessed: articles.length,
      articlesSaved: savedCount,
    })
  } catch (error) {
    console.error('Error in /api/refresh-news:', error)
    res.status(500).json({ error: 'Failed to refresh news' })
  }
}
