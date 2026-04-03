export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: 'ia' | 'data-science' | 'cursos' | 'certificaciones' | 'github';
  publishedAt: string;
  imageUrl?: string;
  createdAt: string;
}

export interface GeneratedContent {
  id: string;
  articleId: string;
  type: 'reel' | 'linkedin';
  content: string;
  createdAt: string;
}

export interface ReelScript {
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  duration: number; // segundos
}

export interface LinkedInPost {
  content: string;
  hashtags: string[];
  mentions?: string[];
}
