import { useState } from 'react'
import type { NewsArticle, ReelScript, LinkedInPost } from '@/types'

interface ArticleCardProps {
  article: NewsArticle
  onReelGenerated?: (reel: ReelScript) => void
  onLinkedInGenerated?: (post: LinkedInPost) => void
}

export function ArticleCard({
  article,
  onReelGenerated,
  onLinkedInGenerated,
}: ArticleCardProps) {
  const [loadingReel, setLoadingReel] = useState(false)
  const [loadingLinkedIn, setLoadingLinkedIn] = useState(false)
  const [generatedReel, setGeneratedReel] = useState<ReelScript | null>(null)
  const [generatedPost, setGeneratedPost] = useState<LinkedInPost | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateReel = async () => {
    setLoadingReel(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          title: article.title,
          description: article.description,
          category: article.category,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate reel')

      const reel = await response.json()
      setGeneratedReel(reel)
      onReelGenerated?.(reel)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating reel')
    } finally {
      setLoadingReel(false)
    }
  }

  const generateLinkedIn = async () => {
    setLoadingLinkedIn(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          title: article.title,
          description: article.description,
          category: article.category,
          source: article.source,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate post')

      const post = await response.json()
      setGeneratedPost(post)
      onLinkedInGenerated?.(post)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating post')
    } finally {
      setLoadingLinkedIn(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900 flex-1">
            {article.title}
          </h3>
          <span className="px-3 py-1 bg-ai-blue text-white text-xs font-semibold rounded-full whitespace-nowrap">
            {article.category.replace('-', ' ')}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2">{article.description}</p>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold">{article.source}</span>
          <span>•</span>
          <span>{new Date(article.publishedAt).toLocaleDateString('es-ES')}</span>
        </div>
      </div>

      {/* Generated Content Display */}
      {generatedReel && (
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">📹 Reel Script</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong className="text-blue-700">Hook:</strong>
              <p className="text-gray-700 mt-1">{generatedReel.hook}</p>
            </div>
            <div>
              <strong className="text-blue-700">Body:</strong>
              <p className="text-gray-700 mt-1">{generatedReel.body}</p>
            </div>
            <div>
              <strong className="text-blue-700">CTA:</strong>
              <p className="text-gray-700 mt-1">{generatedReel.cta}</p>
            </div>
            <div>
              <strong className="text-blue-700">Hashtags:</strong>
              <p className="text-gray-700 mt-1">
                {generatedReel.hashtags.join(' ')}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${generatedReel.hook}\n\n${generatedReel.body}\n\n${generatedReel.cta}\n\n${generatedReel.hashtags.join(' ')}`
                  )
                }}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                📋 Copy to clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {generatedPost && (
        <div className="p-4 bg-purple-50 border-t border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">💼 LinkedIn Post</h4>
          <p className="text-sm text-gray-700 mb-2">{generatedPost.content}</p>
          <p className="text-xs text-gray-600 mb-3">
            {generatedPost.hashtags.join(' ')}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${generatedPost.content}\n\n${generatedPost.hashtags.join(' ')}`
              )
            }}
            className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
          >
            📋 Copy to clipboard
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 flex gap-2 border-t border-gray-200 bg-gray-50">
        <button
          onClick={generateReel}
          disabled={loadingReel || loadingLinkedIn}
          className="flex-1 py-2 px-4 bg-ai-blue text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loadingReel ? '⏳ Generating...' : '📹 Reel Script'}
        </button>

        <button
          onClick={generateLinkedIn}
          disabled={loadingLinkedIn || loadingReel}
          className="flex-1 py-2 px-4 bg-ai-purple text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loadingLinkedIn ? '⏳ Generating...' : '💼 LinkedIn Post'}
        </button>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-4 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 transition-colors text-center"
        >
          🔗 Original
        </a>
      </div>
    </div>
  )
}
