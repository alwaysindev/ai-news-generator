import { useState, useEffect } from 'react'
import type { NewsArticle } from '@/types'
import { ArticleCard } from '@/components/ArticleCard'

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const categories = [
    { id: 'ia', label: '🤖 IA' },
    { id: 'data-science', label: '📊 Data Science' },
    { id: 'cursos', label: '📚 Cursos' },
    { id: 'certificaciones', label: '🏆 Certificaciones' },
    { id: 'github', label: '⭐ GitHub Trending' },
  ]

  // Cargar artículos al montar
  useEffect(() => {
    loadArticles()
  }, [])

  // Filtrar por categoría
  useEffect(() => {
    if (selectedCategory) {
      setFilteredArticles(
        articles.filter((a) => a.category === selectedCategory)
      )
    } else {
      setFilteredArticles(articles)
    }
  }, [selectedCategory, articles])

  const loadArticles = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/articles')
      if (!response.ok) throw new Error('Failed to fetch articles')

      const data = await response.json()
      setArticles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading articles')
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshNews = async () => {
    setRefreshing(true)

    try {
      const response = await fetch('/api/refresh-news', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_INTERNAL_API_KEY || '',
        },
      })

      if (!response.ok) throw new Error('Failed to refresh')

      const result = await response.json()
      console.log(result)

      // Recargar artículos
      await loadArticles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error refreshing news')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-ai-dark to-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-ai-blue to-ai-purple bg-clip-text text-transparent">
                AI & Data News Hub
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Noticias diarias + Generador de contenido para reels y LinkedIn
              </p>
            </div>

            <button
              onClick={handleRefreshNews}
              disabled={refreshing}
              className="px-4 py-2 bg-ai-purple text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {refreshing ? '⏳ Actualizando...' : '🔄 Actualizar'}
            </button>
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === null
                  ? 'bg-ai-blue text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              ✨ Todas
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id
                  )
                }
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-ai-blue text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin">
              <div className="h-12 w-12 border-4 border-ai-blue border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No hay artículos disponibles en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>
            Powered by OpenAI GPT-4 | Agregación de noticias automática | Made
            for alwaysindev
          </p>
        </div>
      </footer>
    </div>
  )
}
