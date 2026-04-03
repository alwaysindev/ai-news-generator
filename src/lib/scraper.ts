import axios from 'axios'
import { parse } from 'rss-parser'
import { v4 as uuidv4 } from 'uuid'
import type { NewsArticle } from '@/types'

const parser = new parse()

// RSS Feeds configurados
const RSS_FEEDS = {
  'ia': [
    'https://feeds.theverge.com/c/1019033/feed/rss.xml', // The Verge - AI
    'https://feeds.bloomberg.com/markets/news.rss', // Bloomberg Tech
  ],
  'data-science': [
    'https://towardsdatascience.com/feed', // Towards Data Science
    'https://www.analyticsvidhya.com/feed/', // Analytics Vidhya
  ],
  'cursos': [
    // Scrapeamos desde GitHub/websites de cursos populares
  ],
}

// URLs para scraping (cursos, certificaciones, repos trending)
const SCRAPE_SOURCES = {
  cursos: [
    'https://www.edx.org/search?q=data%20science',
    'https://www.coursera.org/search?query=data%20science',
  ],
  certificaciones: [
    'https://learn.microsoft.com/en-us/training/',
  ],
  github: [
    'https://github.com/trending?spoken_language_code=en&since=daily',
  ],
}

export async function fetchRSSArticles(): Promise<NewsArticle[]> {
  const articles: NewsArticle[] = []

  for (const [category, feeds] of Object.entries(RSS_FEEDS)) {
    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl)

        feed.items.slice(0, 5).forEach((item) => {
          if (item.title && item.link) {
            articles.push({
              id: uuidv4(),
              title: item.title,
              description: item.contentSnippet || item.content || '',
              url: item.link,
              source: feed.title || 'Unknown',
              category: category as any,
              publishedAt: item.pubDate || new Date().toISOString(),
              imageUrl: item.image?.url,
              createdAt: new Date().toISOString(),
            })
          }
        })
      } catch (error) {
        console.error(`Error fetching RSS from ${feedUrl}:`, error)
      }
    }
  }

  return articles
}

export async function fetchGitHubTrending(): Promise<NewsArticle[]> {
  const articles: NewsArticle[] = []

  try {
    const response = await axios.get(
      'https://api.github.com/search/repositories?q=language:python+stars:>1000&sort=stars&order=desc&per_page=10'
    )

    response.data.items.forEach((repo: any) => {
      articles.push({
        id: uuidv4(),
        title: `GitHub: ${repo.name}`,
        description: repo.description || 'New trending repository on GitHub',
        url: repo.html_url,
        source: 'GitHub Trending',
        category: 'github',
        publishedAt: repo.updated_at,
        imageUrl: repo.owner.avatar_url,
        createdAt: new Date().toISOString(),
      })
    })
  } catch (error) {
    console.error('Error fetching GitHub trending:', error)
  }

  return articles
}

export async function fetchMicrosoftCourses(): Promise<NewsArticle[]> {
  const articles: NewsArticle[] = []

  try {
    // Simulamos scraping de nuevos cursos de Microsoft Learn
    // En producción usarías Cheerio + Playwright para scraping real
    const mockCourses = [
      {
        title: 'Azure AI Fundamentals - Nuevo módulo',
        url: 'https://learn.microsoft.com/training/paths/get-started-with-artificial-intelligence/',
      },
      {
        title: 'Data Science con Azure ML - Actualización 2024',
        url: 'https://learn.microsoft.com/training/paths/data-science-azure-machine-learning/',
      },
    ]

    mockCourses.forEach((course) => {
      articles.push({
        id: uuidv4(),
        title: course.title,
        description: 'Nuevo curso gratuito en Microsoft Learn',
        url: course.url,
        source: 'Microsoft Learn',
        category: 'cursos',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
    })
  } catch (error) {
    console.error('Error fetching Microsoft courses:', error)
  }

  return articles
}

export async function fetchAllNews(): Promise<NewsArticle[]> {
  const [rssArticles, githubArticles, courseArticles] = await Promise.all([
    fetchRSSArticles(),
    fetchGitHubTrending(),
    fetchMicrosoftCourses(),
  ])

  // Removemos duplicados por URL
  const allArticles = [...rssArticles, ...githubArticles, ...courseArticles]
  const uniqueByUrl = Array.from(
    new Map(allArticles.map((article) => [article.url, article])).values()
  )

  return uniqueByUrl
}
