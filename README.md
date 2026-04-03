# 🚀 AI & Data News Hub

Una web que agrega **noticias diarias de IA, Data Science y cursos** y genera automáticamente **scripts de reels y posts de LinkedIn** usando OpenAI.

**Ideal para**: Content creators, data scientists, influencers tech que quieren sistematizar su contenido.

![Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Stack](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Stack](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)
![Stack](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=flat-square)
![Stack](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)

---

## ✨ Features

### 📰 Agregación de noticias
- ✅ **RSS Feeds**: Towards Data Science, Analytics Vidhya, The Verge AI
- ✅ **GitHub Trending**: Repos con tendencia en Python/ML/Data
- ✅ **Cursos nuevos**: Microsoft Learn, Coursera, Edx
- ✅ **Certificaciones**: AWS, Azure, Google Cloud
- ✅ **Actualización automática**: Diaria a las 9 AM (configurable)

### 🎬 Generación de contenido
- ✅ **Scripts de Reel** (30-60s):
  - Hook impactante
  - Body con puntos clave
  - CTA accionable
  - Hashtags relevantes
  
- ✅ **Posts de LinkedIn**:
  - Contenido profesional (800-1200 chars)
  - Insights personales
  - Reflexiones de valor
  - Hashtags + mentions

### 🎨 Interfaz moderna
- Dark mode design
- Filtros por categoría
- Botón de actualización manual
- Copy-to-clipboard para cada contenido generado
- Responsive mobile-first

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **Backend** | Next.js 14 API Routes (Serverless) |
| **Database** | Supabase (PostgreSQL) |
| **AI/LLM** | OpenAI GPT-4 Turbo |
| **Scraping** | Cheerio + RSS Parser + GitHub API |
| **Hosting** | Vercel (free tier) |
| **Auth** | API Key simple (interno) |

---

## 🚀 Quickstart

### Requisitos
- Node.js 18+
- npm o yarn
- Cuenta OpenAI con créditos
- Cuenta Supabase (free)
- Cuenta Vercel (free)

### 1. Clonar y instalar

```bash
git clone https://github.com/tu-usuario/ai-news-generator.git
cd ai-news-generator
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Editar `.env.local`:
```env
# OpenAI
OPENAI_API_KEY=sk_your_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Internal
INTERNAL_API_KEY=tu_key_segura_aqui
NEXT_PUBLIC_INTERNAL_API_KEY=tu_key_segura_aqui
```

### 3. Configurar Supabase

Ver instrucciones completas en [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

En resumen:
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar SQL de setup
3. Copiar credenciales a `.env.local`

### 4. Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 5. Deploy en Vercel

```bash
npm install -g vercel
vercel
```

Ver guía completa en [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

---

## 📚 Documentación

- **[Guía de Supabase](docs/SUPABASE_SETUP.md)**: Crear tablas y configurar BD
- **[Guía de Deploy](docs/DEPLOYMENT.md)**: Deploy en Vercel + cron jobs
- **[API Reference](#api-reference)**: Endpoints disponibles

---

## 📡 API Reference

### `GET /api/articles`
Obtiene artículos con filtros opcionales.

**Query params:**
```
category?: 'ia' | 'data-science' | 'cursos' | 'certificaciones' | 'github'
limit?: number (default: 50)
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "New GPT-4 Features",
    "description": "...",
    "url": "https://...",
    "source": "OpenAI Blog",
    "category": "ia",
    "publishedAt": "2024-01-15T10:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### `POST /api/generate-reel`
Genera un script de reel para una noticia.

**Body:**
```json
{
  "articleId": "uuid",
  "title": "Article Title",
  "description": "Article description",
  "category": "ia"
}
```

**Response:**
```json
{
  "hook": "¿Sabías que GPT-4 ahora puede...",
  "body": "Explicación clara en 2-3 puntos",
  "cta": "Guarda esto para tus proyectos",
  "hashtags": ["#IA", "#GPT4", "#Python"],
  "duration": 45
}
```

### `POST /api/generate-linkedin`
Genera un post de LinkedIn para una noticia.

**Body:**
```json
{
  "articleId": "uuid",
  "title": "Article Title",
  "description": "Article description",
  "category": "ia",
  "source": "OpenAI"
}
```

**Response:**
```json
{
  "content": "Long-form post content...",
  "hashtags": ["#IA", "#DataScience"],
  "mentions": []
}
```

### `POST /api/refresh-news`
Actualiza las noticias desde todas las fuentes.

**Headers:**
```
x-api-key: INTERNAL_API_KEY
```

**Response:**
```json
{
  "message": "News updated successfully",
  "articlesProcessed": 45,
  "articlesSaved": 42
}
```

---

## 📊 Estructura de datos

### Tabla `articles`
```sql
id: uuid (PK)
title: text
description: text
url: text (UNIQUE)
source: text
category: enum ('ia', 'data-science', 'cursos', 'certificaciones', 'github')
published_at: timestamp
image_url: text
created_at: timestamp
updated_at: timestamp
```

### Tabla `generated_content`
```sql
id: text (PK)
article_id: uuid (FK)
type: enum ('reel', 'linkedin')
content: jsonb (contiene ReelScript o LinkedInPost)
created_at: timestamp
updated_at: timestamp
```

---

## 💡 Casos de uso

### Para content creators
```
1. Web carga noticias del día
2. Escoges una que te interesa
3. Generas script de reel en 3 segundos
4. Copias y grabas en Premiere
5. Público 2 horas después
```

### Para educators
```
1. Publicas el lunes
2. Tienes 5 noticias de la semana
3. Generas 5 scripts de reel
4. Publicas contenido M-V, una por día
5. Audiencia consistente
```

### Para data scientists
```
1. Monitoreas tendencias en Python/ML
2. Ves nuevos repos que shippan features
3. Entiendes rápido qué está de moda
4. Te mantiene actualizado
```

---

## ⚙️ Configuración avanzada

### Cambiar fuentes de RSS
Editar `src/lib/scraper.ts`:

```typescript
const RSS_FEEDS = {
  'ia': [
    'https://feeds.theverge.com/c/1019033/feed/rss.xml', // Cambiar aquí
    'https://feeds.bloomberg.com/markets/news.rss',
  ],
  // ...
}
```

### Optimizar costos de OpenAI
```typescript
// En src/lib/openai.ts, cambiar modelo:
model: 'gpt-3.5-turbo' // Más barato (~10x), casi igual calidad
```

### Personalizar prompts
```typescript
// En src/lib/openai.ts
const prompt = `
  // Tu prompt personalizado aquí
  // Ej: agregar menciones a personas específicas, tone diferente, etc.
`
```

---

## 🔧 Troubleshooting

### ❌ "Error: Missing OPENAI_API_KEY"
**Solución**: Verifica que `.env.local` existe y tiene la key correcta

### ❌ "Database connection error"
**Solución**: Chequea URL y keys de Supabase en `.env.local`

### ❌ "No articles found"
**Solución**: 
1. Haz click en "🔄 Actualizar"
2. Revisa consola Vercel para errores de scraping
3. Verifica que feeds RSS están accesibles

### ❌ "Rate limit exceeded"
**Solución**: OpenAI tiene límites de requests. Espera un minuto y reintenta

---

## 📈 Roadmap

- [ ] Integración directa con Instagram/TikTok
- [ ] Sistema de drafts y scheduling
- [ ] Analytics: qué contenido genera más engagement
- [ ] Más fuentes (Medium, Dev.to, Substack, Hacker News)
- [ ] Generación de imágenes (DALL-E)
- [ ] Multiidioma (ES, EN, PT)
- [ ] Historial de contenido generado
- [ ] Exportar a Notion/Obsidian
- [ ] Mobile app (React Native)

---

## 💰 Costos estimados

| Servicio | Free Tier | Costo |
|----------|-----------|-------|
| **Vercel** | ✅ Sí | $0 |
| **Supabase** | ✅ 500MB storage | $0 |
| **OpenAI** | ❌ No | $0.10-1.00/día |
| **TOTAL** | - | **~$3-30/mes** |

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios significativos:

1. Fork el repo
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Ver [`LICENSE`](LICENSE) para detalles

---

## 👨‍💻 Autor

Creado por [Alejandro Cárabe](https://alwaysindev.com) - Data Scientist & Content Creator

Para **alwaysindev** 🎬📊💻

---

## 🙏 Agradecimientos

- OpenAI por GPT-4 Turbo
- Vercel por hosting gratuito y fácil
- Supabase por PostgreSQL libre
- La comunidad de Python/Data Science

---

## 📞 Soporte

¿Preguntas o issues?

1. Revisa la [documentación](docs/)
2. Crea un [Issue en GitHub](https://github.com/tu-usuario/ai-news-generator/issues)
3. Contacta: [@alwaysindev](https://linkedin.com/in/alejandro-carabe)

---

**⭐ Si te es útil, deja una star! ⭐**
