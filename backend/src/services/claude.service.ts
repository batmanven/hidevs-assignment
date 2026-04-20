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
  customer: `You are a price-sensitive college student. React realistically to this product. Be critical and practical. Reference and react to points made by investors or operations managers if you disagree with their assumptions about what you want. Ask tough questions about pricing, reliability, and value.`,

  competitor: `You are a competitor in this market. Analyze this idea strategically. If the operations manager claims execution is easy, point out the competitive barriers. If the investor sees high growth, explain how you would block them. Be strategic, analytical, and competitive.`,

  investor: `You are a venture capitalist. Assess market potential and risk. Listen to the customer's concerns about price-sensitivity and the operations manager's feasibility report. Ask agents to defend their positions if they seem too optimistic or pessimistic. Be demanding about ROI and scalability.`,

  operations: `You are an operations manager. Evaluate practical feasibility. If the competitor mentions specific logistics barriers, address them. If the customer wants features that are too complex to build, explain the trade-offs. Focus on execution, supply chain, and staffing complexity.`
}
