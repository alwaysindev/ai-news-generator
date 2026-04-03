import OpenAI from 'openai'
import type { ReelScript, LinkedInPost } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateReelScript(
  title: string,
  description: string,
  category: string
): Promise<ReelScript | null> {
  try {
    const prompt = `
Eres un experto en crear guiones virales para reels de redes sociales sobre IA, Data Science y tech.

ARTÍCULO:
Título: ${title}
Descripción: ${description}
Categoría: ${category}

Genera un GUIÓN DE REEL (30-60 segundos) que sea:
- IMPACTANTE: Hook en los primeros 2 segundos
- CLARO: Lenguaje simple, sin jerga
- ACCIONABLE: Deja un CTA (call-to-action)
- VIRAL: Con elementos que generen engagement

FORMATO RESPUESTA (JSON):
{
  "hook": "Frase impactante para los primeros 2 segundos (máx 15 palabras)",
  "body": "Explicación del tema en 2-3 puntos clave (máx 100 palabras)",
  "cta": "Call to action (ej: 'Guarda esto', 'Aprende aquí', 'Sígueme para más')",
  "hashtags": ["#IA", "#DataScience", "#Python"],
  "duration": 45
}

Responde SOLO con el JSON válido, sin explicaciones adicionales.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    })

    const content = response.choices[0].message.content
    if (!content) return null

    const parsed = JSON.parse(content)
    return parsed as ReelScript
  } catch (error) {
    console.error('Error generating reel script:', error)
    return null
  }
}

export async function generateLinkedInPost(
  title: string,
  description: string,
  category: string,
  source: string
): Promise<LinkedInPost | null> {
  try {
    const prompt = `
Eres un experto en LinkedIn creando posts que generan engagement en comunidades tech.

ARTÍCULO:
Título: ${title}
Descripción: ${description}
Categoría: ${category}
Fuente: ${source}

Genera un POST DE LINKEDIN que sea:
- PROFESIONAL pero conversacional
- REFLEXIVO: Incluye insights personales
- LARGO: 800-1200 caracteres (máximo LinkedIn)
- ENGANCHADOR: Empieza con una pregunta o stat interesante

ESTRUCTURA:
1. Intro/pregunta impactante
2. Tu perspectiva sobre el tema
3. 2-3 puntos clave
4. Call to action (Ask for comments, share, etc.)
5. Hashtags relevantes

FORMATO RESPUESTA (JSON):
{
  "content": "El contenido completo del post...",
  "hashtags": ["#IA", "#DataScience", "#Python", "#AI"],
  "mentions": []
}

Responde SOLO con el JSON válido.
    `

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    if (!content) return null

    const parsed = JSON.parse(content)
    return parsed as LinkedInPost
  } catch (error) {
    console.error('Error generating LinkedIn post:', error)
    return null
  }
}
