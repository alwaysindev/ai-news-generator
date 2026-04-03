# Configuración de Supabase

## 1. Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Click en "Start your project"
3. Crear cuenta con GitHub
4. Crear nuevo proyecto

## 2. Crear tablas

Ejecuta este SQL en el editor Supabase:

```sql
-- Tabla de artículos
CREATE TABLE articles (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text,
  url text NOT NULL UNIQUE,
  source text,
  category text CHECK (category IN ('ia', 'data-science', 'cursos', 'certificaciones', 'github')),
  published_at timestamptz,
  image_url text,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published ON articles(published_at DESC);

-- Tabla de contenido generado
CREATE TABLE generated_content (
  id text PRIMARY KEY,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  type text CHECK (type IN ('reel', 'linkedin')),
  content jsonb,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE INDEX idx_generated_article ON generated_content(article_id);
CREATE INDEX idx_generated_type ON generated_content(type);
```

## 3. Copiar credenciales

1. Ir a **Project Settings → API**
2. Copiar `Project URL` y `anon public key`
3. Pegar en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

## 4. Permisos de Row Level Security (RLS)

Por defecto, RLS está habilitado. Para este proyecto, puedes usar estos permisos:

```sql
-- Artículos: todos pueden leer
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all users" 
ON articles 
FOR SELECT 
USING (true);

-- Contenido generado: todos pueden leer
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for all users" 
ON generated_content 
FOR SELECT 
USING (true);
```

## 5. Backups automáticos

Supabase hace backups automáticos. Puedes verlos en:
**Project Settings → Backups**
