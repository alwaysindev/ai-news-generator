# 🚀 Guía de Despliegue - AI News Generator

## Paso 1: Preparar credenciales

### OpenAI API Key
1. Ir a [platform.openai.com](https://platform.openai.com)
2. Crear cuenta o loguarse
3. **Billing → Payment methods** → Añadir tarjeta
4. **API keys → Create new secret key**
5. Copiar la key (no podrás verla nuevamente)

### Supabase
1. Ir a [supabase.com](https://supabase.com)
2. Crear proyecto (free tier)
3. Ejecutar las tablas SQL de `docs/SUPABASE_SETUP.md`
4. Copiar `Project URL` y `anon key`

### Vercel
1. Ir a [vercel.com](https://vercel.com)
2. Loguarse con GitHub
3. Conectar tu repo

## Paso 2: Variables de entorno

Copia `.env.local.example` a `.env.local` y completa:

```bash
OPENAI_API_KEY=sk_your_key_here
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
INTERNAL_API_KEY=cualquier_string_seguro_que_inventas
NEXT_PUBLIC_INTERNAL_API_KEY=mismo_string
```

## Paso 3: Deploy en Vercel

### Opción A: Via CLI
```bash
npm i -g vercel
vercel login
vercel
```

### Opción B: Via GitHub
1. Push código a GitHub
2. En Vercel, click "New Project"
3. Seleccionar repo
4. Importar variables de `.env.local`
5. Click "Deploy"

## Paso 4: Configurar cron job automático

La actualización automática de noticias se puede hacer de 3 formas:

### Opción 1: Vercel Cron (RECOMENDADO)
Crea `src/pages/api/cron/refresh-news.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validar que viene del cron de Vercel
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Llamar a refresh-news
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/refresh-news`,
      {
        method: 'POST',
        headers: {
          'x-api-key': process.env.INTERNAL_API_KEY!,
        },
      }
    )

    const result = await response.json()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh' })
  }
}
```

En `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/refresh-news",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Opción 2: Tu servidor (VPS)
```bash
# En crontab
0 9 * * * cd /path/to/project && npm run extract-news
```

### Opción 3: EasyCron (Servicio externo)
1. Ir a [easycron.com](https://easycron.com)
2. Crear cron job
3. URL: `https://tu-dominio.vercel.app/api/refresh-news`
4. Header: `x-api-key: tu_internal_api_key`
5. Scheduling: Daily 9:00 AM

## Paso 5: Verificar funcionamiento

1. Ir a tu URL en Vercel
2. Ver artículos (deben venir vacíos inicialmente)
3. Click en "🔄 Actualizar" para hacer sync manual
4. Esperar a que carguen noticias
5. Click en "📹 Reel Script" para generar contenido

## Costos estimados

| Servicio | Costo |
|----------|-------|
| **Vercel** | $0 (free tier) |
| **Supabase** | $0 (free tier, 500MB storage) |
| **OpenAI** | ~$0.10-1.00/día (muy variable) |
| **TOTAL** | **Muy bajo** |

### Cómo reducir costos de OpenAI:
- Usar `gpt-3.5-turbo` en lugar de GPT-4 (más barato, igual calidad)
- Limitar a 5 generaciones por artículo
- Cachear resultados

## Troubleshooting

### "Error: Missing required fields"
- Verifica que la API recibe title y description

### "Failed to generate reel"
- Verifica tu OpenAI API key
- Chequea tu saldo en OpenAI

### "Database connection error"
- Verifica URL y keys de Supabase
- Chequea que las tablas están creadas

### "No articles found"
- Ejecuta el botón "🔄 Actualizar" manualmente
- Revisa la consola de Vercel para errores de scraping

## Siguientes pasos

1. **Mejorar scraping**: Añadir más fuentes (Medium, Dev.to, etc.)
2. **Almacenar drafts**: Guardar borradores en BD
3. **Sistema de tags**: Permitir tags personalizados
4. **Analytics**: Trackear qué contenido genera más engagement
5. **Integración directa**: Publicar a TikTok/Instagram/LinkedIn automáticamente
