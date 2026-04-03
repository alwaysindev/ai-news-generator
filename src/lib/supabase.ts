import { createClient } from '@supabase/supabase-js'
import type { NewsArticle, GeneratedContent } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ========== ARTICLES ==========
export async function getArticles(category?: string, limit = 50) {
  let query = supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data as NewsArticle[]
}

export async function upsertArticle(article: NewsArticle) {
  const { error } = await supabase
    .from('articles')
    .upsert([article], { onConflict: 'id' })

  if (error) {
    console.error('Error upserting article:', error)
  }

  return !error
}

export async function deleteOldArticles(daysOld = 30) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  const { error } = await supabase
    .from('articles')
    .delete()
    .lt('published_at', cutoffDate.toISOString())

  if (error) {
    console.error('Error deleting old articles:', error)
  }

  return !error
}

// ========== GENERATED CONTENT ==========
export async function saveGeneratedContent(content: GeneratedContent) {
  const { data, error } = await supabase
    .from('generated_content')
    .insert([content])

  if (error) {
    console.error('Error saving content:', error)
  }

  return data
}

export async function getGeneratedContent(articleId: string) {
  const { data, error } = await supabase
    .from('generated_content')
    .select('*')
    .eq('article_id', articleId)

  if (error) {
    console.error('Error fetching content:', error)
    return []
  }

  return data as GeneratedContent[]
}
