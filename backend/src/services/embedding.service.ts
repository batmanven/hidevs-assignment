import { prisma } from '../lib/prisma'
import Anthropic from '@anthropic-ai/sdk'
import { config } from '../config'

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey })

export interface EmbeddingResult {
  id: string
  content: string
  similarity: number
  metadata?: Record<string, any>
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Generate a vector representation of the following text for semantic search. Return only a JSON array of 1536 numbers between -1 and 1.\n\nText: ${text}`
      }]
    })

    const content = response.content[0]
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\[.*\]/s)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    }

    return new Array(1536).fill(0)
  } catch (error) {
    console.error('Error generating embedding:', error)
    return new Array(1536).fill(0)
  }
}

export async function storeEmbedding(
  content: string,
  metadata?: Record<string, any>
): Promise<string> {
  const embedding = await generateEmbedding(content)
  const id = crypto.randomUUID()
  const vectorStr = `[${embedding.join(',')}]`

  await prisma.$executeRaw`
    INSERT INTO "Embedding" (id, content, vector, metadata, createdAt)
    VALUES (${id}, ${content}, ${vectorStr}::vector, ${metadata || {}}::jsonb, NOW())
  `

  return id
}

export async function searchSimilarEmbeddings(
  query: string,
  limit: number = 5
): Promise<EmbeddingResult[]> {
  try {
    const queryEmbedding = await generateEmbedding(query)
    const vectorStr = `[${queryEmbedding.join(',')}]`

    
    const results = await prisma.$queryRaw<any[]>`
      SELECT 
        id, 
        content, 
        metadata,
        1 - (vector <=> ${vectorStr}::vector) as similarity
      FROM "Embedding"
      WHERE vector IS NOT NULL
      ORDER BY vector <=> ${vectorStr}::vector ASC
      LIMIT ${limit}
    `

    return results.map(r => ({
      id: r.id,
      content: r.content,
      similarity: Number(r.similarity),
      metadata: r.metadata as Record<string, any>
    }))
  } catch (error) {
    console.error('Vector search failed, falling back to basic search:', error)
    
    const matches = await prisma.embedding.findMany({
      where: {
        content: { contains: query, mode: 'insensitive' }
      },
      take: limit
    })
    return matches.map(m => ({
      id: m.id,
      content: m.content,
      similarity: 0.5,
      metadata: m.metadata as Record<string, any>
    }))
  }
}

export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  if (normA === 0 || normB === 0) return 0

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export async function initializeKnowledgeBase(): Promise<void> {
  const existingCount = await prisma.embedding.count()
  if (existingCount > 0) return

  const knowledgeBase = [
    {
      content: "Food delivery apps face high customer acquisition costs, typically $20-50 per user. College students are price-sensitive with average monthly food budget of $200-400. Low pricing strategies often lead to unit economics challenges.",
      metadata: { category: "market", source: "industry_analysis" }
    },
    {
      content: "Startup failure rate: 90% fail within first year. Top reasons: no market need (42%), running out of cash (29%), wrong team (23%), competition (19%). Food delivery specifically has high competition with DoorDash, Uber Eats, Grubhub dominating.",
      metadata: { category: "risks", source: "startup_stats" }
    },
    {
      content: "College campus markets have unique characteristics: high density, predictable schedules, limited dining options during late hours. Successful campus food services focus on speed, price, and convenience.",
      metadata: { category: "market", source: "campus_insights" }
    },
    {
      content: "Pricing models for food delivery: commission 15-30%, delivery fees $3-5, subscription models $9.99/month. Low-price models often require high volume to achieve profitability.",
      metadata: { category: "pricing", source: "business_models" }
    },
    {
      content: "Operational challenges for food delivery: driver availability during peak hours, food quality maintenance, order accuracy, delivery time consistency. College areas have driver shortages during meal times.",
      metadata: { category: "operations", source: "logistics" }
    },
    {
      content: "Competitive response strategies: price matching, exclusive partnerships, loyalty programs, faster delivery times. Incumbents can leverage existing driver networks and restaurant relationships.",
      metadata: { category: "competition", source: "strategy" }
    },
    {
      content: "Investment requirements for food delivery: initial capital $500K-2M, burn rate $50-100K/month, runway 12-18 months. Key metrics: order volume, customer retention, unit economics, market share.",
      metadata: { category: "investment", source: "funding" }
    },
    {
      content: "Technology stack for food delivery: mobile apps (iOS/Android), web dashboard, driver app, restaurant portal, real-time tracking, payment processing. Development cost $100-300K.",
      metadata: { category: "technology", source: "development" }
    }
  ]

  for (const item of knowledgeBase) {
    await storeEmbedding(item.content, item.metadata)
  }

  console.log('Knowledge base initialized with embeddings')
}
