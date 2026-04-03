# 🏗️ Arquitectura del Proyecto

## Flujo de datos

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USUARIOS                                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  Frontend React  │
                    │  (Vercel)        │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────────┐  ┌───────▼──────┐  ┌─────────▼────────┐
   │ GET articles │  │ POST reel    │  │ POST linkedin    │
   └────┬────────┘  └───────┬──────┘  └─────────┬────────┘
        │                   │                    │
        │          ┌────────▼────────┐          │
        │          │ OpenAI GPT-4    │          │
        │          │ (Content Gen)   │          │
        │          └────────┬────────┘          │
        │                   │                    │
        └───────────────────┼────────────────────┘
                            │
        ┌───────────────────▼────────────────────┐
        │     Next.js API Routes (Vercel)        │
        │                                         │
        │  • /api/articles                      │
        │  • /api/generate-reel                 │
        │  • /api/generate-linkedin             │
        │  • /api/refresh-news                  │
        └───────────────────┬────────────────────┘
                            │
              ┌─────────────▼──────────────┐
              │   Supabase (PostgreSQL)    │
              │                            │
              │  • articles table          │
              │  • generated_content table │
              └────────────────────────────┘
```

## Scraping de noticias

```
┌─────────────────────────────────────────────────────┐
│         Actualización diaria (9 AM vía cron)        │
└────────────────┬────────────────────────────────────┘
                 │
    ┌────────────┼────────────┬─────────────┐
    │            │            │             │
┌───▼────┐  ┌───▼────┐  ┌───▼─────┐  ┌──▼───┐
│  RSS    │  │ GitHub │  │Microsoft│  │Mock  │
│ Feeds   │  │ API    │  │ Learn   │  │Data  │
│         │  │        │  │         │  │      │
│• TDS    │  │Trending│  │Cursos   │  │Certs │
│• AnVid  │  │ Python │  │Training │  │      │
│• Verge  │  │ Repos  │  │Paths    │  │      │
└───┬────┘  └───┬────┘  └────┬────┘  └──┬───┘
    │           │            │          │
    └───────────┼────────────┼──────────┘
                │
    ┌───────────▼────────────────────┐
    │  src/lib/scraper.ts            │
    │  Fetch + Parse articles        │
    │                                 │
    │  → Deduplicate by URL          │
    │  → Format to NewsArticle       │
    └───────────┬────────────────────┘
                │
    ┌───────────▼────────────────────┐
    │  Supabase: articles table      │
    │  (Upsert - Update if exists)   │
    └────────────────────────────────┘
```

## Generación de contenido

```
Noticia seleccionada
        │
    ┌───▼───────────────────────────┐
    │  Usuario hace click en:        │
    │  • "📹 Reel Script"            │
    │  • "💼 LinkedIn Post"          │
    └───┬───────────────────────────┘
        │
    ┌───▼─────────────────────────────────┐
    │  POST /api/generate-reel (-linkedin)│
    │  Body: {title, description, ...}   │
    └───┬─────────────────────────────────┘
        │
    ┌───▼──────────────────────────┐
    │  OpenAI API (GPT-4 Turbo)    │
    │                              │
    │  Prompt generado con:        │
    │  • Title y description       │
    │  • Instrucciones específicas │
    │  • Format esperado (JSON)    │
    └───┬──────────────────────────┘
        │
    ┌───▼──────────────────────────────┐
    │  Parse response JSON              │
    │                                   │
    │  ReelScript:                      │
    │  • hook: "Frase impactante"      │
    │  • body: "2-3 puntos clave"      │
    │  • cta: "Call to action"         │
    │  • hashtags: []                  │
    │  • duration: 45 (segundos)       │
    │                                   │
    │  LinkedInPost:                    │
    │  • content: "Largo form"          │
    │  • hashtags: []                  │
    │  • mentions: []                  │
    └───┬──────────────────────────────┘
        │
    ┌───▼──────────────────────────────┐
    │  Guardar en generated_content     │
    │  Mostrar en UI                    │
    │  "📋 Copy to clipboard"           │
    └──────────────────────────────────┘
```

## Estructura de directorios

```
ai-news-generator/
├── 📄 README.md                 ← Documentación principal
├── 📄 QUICKSTART.md             ← Setup rápido
├── 📄 GITHUB_SETUP.md           ← Cómo subir a GitHub
├── 📄 package.json              ← Dependencias
├── 📄 tsconfig.json             ← TypeScript config
├── 📄 next.config.js            ← Next.js config
├── 📄 tailwind.config.js        ← Estilos Tailwind
├── 📄 vercel.json               ← Vercel config + Crons
├── 📄 .env.local.example        ← Variables de ejemplo
├── 📄 .gitignore                ← Archivos a ignorar
├── 📄 LICENSE                   ← MIT License
│
├── 📁 src/
│   ├── 📁 pages/
│   │   ├── 📄 index.tsx          ← Página principal (UI)
│   │   ├── 📄 _app.tsx           ← Setup global
│   │   └── 📁 api/
│   │       ├── 📄 articles.ts    ← GET artículos
│   │       ├── 📄 generate-reel.ts       ← POST generar reel
│   │       ├── 📄 generate-linkedin.ts   ← POST generar LinkedIn
│   │       └── 📄 refresh-news.ts        ← POST actualizar noticias
│   │
│   ├── 📁 components/
│   │   └── 📄 ArticleCard.tsx    ← Componente artículo
│   │
│   ├── 📁 lib/
│   │   ├── 📄 supabase.ts        ← Conexión BD
│   │   ├── 📄 openai.ts          ← Generación de contenido
│   │   └── 📄 scraper.ts         ← Extracción de noticias
│   │
│   ├── 📁 types/
│   │   └── 📄 index.ts           ← TypeScript types
│   │
│   └── 📁 styles/
│       └── 📄 globals.css        ← Estilos globales
│
├── 📁 scripts/
│   └── 📄 extractNews.js         ← Script cron manual
│
└── 📁 docs/
    ├── 📄 SUPABASE_SETUP.md      ← Setup de Supabase
    └── 📄 DEPLOYMENT.md          ← Guía de deploy
```

## Stack de tecnologías

```
┌──────────────────────────────────────────────────┐
│              FRONTEND (Cliente)                   │
├──────────────────────────────────────────────────┤
│ • React 18          - UI Framework               │
│ • TypeScript 5      - Type safety                │
│ • Tailwind CSS 3    - Styling                    │
│ • Next.js Pages     - Routing                    │
└──────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────┐
│         BACKEND (API Routes en Vercel)           │
├──────────────────────────────────────────────────┤
│ • Next.js 14        - Framework                  │
│ • API Routes        - Serverless endpoints       │
│ • Vercel            - Hosting + Crons            │
└──────────────────────────────────────────────────┘
            │
        ┌───┴────┬─────────┬──────────┐
        ▼        ▼         ▼          ▼
    ┌────┐  ┌──────┐  ┌─────────┐  ┌──────┐
    │RSS │  │GitHub│  │Microsoft│  │Mock  │
    └────┘  │ API  │  │ Learn   │  └──────┘
           └──────┘  └─────────┘
        
            │
            ▼
    ┌──────────────────┐
    │   OpenAI API     │
    │   GPT-4 Turbo    │
    └──────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────┐
│         DATABASE (Supabase PostgreSQL)           │
├──────────────────────────────────────────────────┤
│ • articles         - Noticias                    │
│ • generated_content - Scripts de reel + LinkedIn │
│ • Backups automáticos                           │
│ • Free tier: 500MB storage                      │
└──────────────────────────────────────────────────┘
```

## Flujo de actualización automática

```
┌─────────────────────────────────────┐
│   Vercel Cron (9 AM diariamente)   │
└─────────────┬───────────────────────┘
              │
    ┌─────────▼──────────┐
    │ GET /api/refresh-news
    │ (con header x-api-key)
    └─────────┬──────────┘
              │
    ┌─────────▼────────────────────┐
    │ src/lib/scraper.ts           │
    │                              │
    │ Fetch todas las fuentes:     │
    │ • RSS feeds                  │
    │ • GitHub API                 │
    │ • Microsoft Learn            │
    │                              │
    │ Remove duplicados por URL    │
    └─────────┬────────────────────┘
              │
    ┌─────────▼────────────────────┐
    │ Supabase upsert articles     │
    │ (insert or update)           │
    │                              │
    │ Delete old articles (>30d)   │
    └─────────┬────────────────────┘
              │
    ┌─────────▼──────────────────┐
    │ Return:                    │
    │ • articlesProcessed: 45    │
    │ • articlesSaved: 42        │
    │ • message: "Success"       │
    └────────────────────────────┘
```

## Costos por región

```
┌──────────────────┬─────────────┬──────────────────┐
│   Servicio       │  Free Tier  │    Costo USD     │
├──────────────────┼─────────────┼──────────────────┤
│ Vercel           │ ✅ Sí       │ $0 (o $20/mes)  │
│ Supabase         │ ✅ 500MB    │ $0 (o $25/mes)  │
│ OpenAI GPT-4     │ ❌ No       │ $0.30-1.00/día  │
├──────────────────┼─────────────┼──────────────────┤
│ TOTAL /mes       │ -           │ ~$10-30          │
└──────────────────┴─────────────┴──────────────────┘
```

---

¿Preguntas sobre la arquitectura? Revisa los archivos en `docs/`
