import { searchSimilarEmbeddings, initializeKnowledgeBase as initEmbeddings } from './embedding.service'

export interface RetrievalResult {
  content: string
  similarity: number
  metadata?: Record<string, any>
}

export async function initializeKnowledgeBase(): Promise<void> {
  await initEmbeddings()
}

export async function retrieveRelevantContext(
  query: string,
  limit: number = 5
): Promise<RetrievalResult[]> {
  try {
    const results = await searchSimilarEmbeddings(query, limit)
    return results
  } catch (error) {
    console.error('Error retrieving context:', error)
    return []
  }
}

export async function getContextForIdea(idea: string): Promise<string> {
  const results = await retrieveRelevantContext(idea, 3)
  
  if (results.length === 0) {
    return ''
  }

  return results.map((r, i) => `[Context ${i + 1}]: ${r.content}`).join('\n\n')
}
