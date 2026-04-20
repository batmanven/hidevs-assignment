import Anthropic from '@anthropic-ai/sdk'
import { config } from '../config'

const anthropic = new Anthropic({
  apiKey: config.anthropicApiKey
})

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeResponse {
  content: string
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

export async function generateResponse(
  messages: ClaudeMessage[],
  systemPrompt?: string,
  maxTokens: number = 4096
): Promise<ClaudeResponse> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })

    const content = response.content[0]?.type === 'text' ? response.content[0].text : ''

    return {
      content,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    }
  } catch (error) {
    console.error('Claude API error:', error)
    throw new Error('Failed to generate response from Claude')
  }
}

export async function generateStreamResponse(
  messages: ClaudeMessage[],
  onChunk: (chunk: string) => void,
  systemPrompt?: string
): Promise<void> {
  try {
    const stream = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      stream: true
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        onChunk(event.delta.text)
      }
    }
  } catch (error) {
    console.error('Claude streaming error:', error)
    throw new Error('Failed to stream response from Claude')
  }
}

export const agentPrompts: Record<string, string> = {
  customer: `You are a price-sensitive college student. React realistically to this product. Be critical and practical. Consider your limited budget, busy schedule, and need for convenience. Ask tough questions about pricing, reliability, and value.`,

  competitor: `You are a competitor in this market. Analyze this idea from a business perspective. Identify threats to your existing business, evaluate their competitive advantage, and consider how you would respond. Be strategic and analytical.`,

  investor: `You are a venture capitalist evaluating this startup. Assess market potential, unit economics, scalability, and risk. Look for red flags and growth opportunities. Be demanding about metrics and realistic about timelines.`,

  operations: `You are an operations manager. Evaluate the practical feasibility of executing this idea. Consider logistics, supply chain, staffing, and operational complexity. Focus on execution challenges and resource requirements.`
}
