import { prisma } from '../lib/prisma'
import { ClaudeMessage, generateResponse } from './claude.service'

export interface ConversationTurn {
  id: string
  agentId: string
  role: string
  content: string
  timestamp: Date
}

export async function createConversation(simulationId: string): Promise<string> {
  const conversation = await prisma.message.create({
    data: {
      simulationId,
      content: 'Conversation started',
      timestamp: new Date()
    }
  })
  return conversation.id
}

export async function addConversationTurn(
  simulationId: string,
  agentId: string,
  role: string,
  content: string
): Promise<void> {
  await prisma.message.create({
    data: {
      simulationId,
      agentId,
      content,
      timestamp: new Date()
    }
  })
}

export async function getConversationHistory(
  simulationId: string,
  limit: number = 10
): Promise<ClaudeMessage[]> {
  const messages = await prisma.message.findMany({
    where: { simulationId },
    orderBy: { timestamp: 'asc' },
    take: limit
  })

  return messages.map(msg => ({
    role: msg.agentId ? 'assistant' : 'user',
    content: msg.content
  }))
}

export async function continueConversation(
  simulationId: string,
  agentId: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const history = await getConversationHistory(simulationId, 20)
  
  const messages: ClaudeMessage[] = [
    ...history,
    { role: 'user', content: userMessage }
  ]

  const response = await generateResponse(messages, systemPrompt)

  await addConversationTurn(simulationId, agentId, 'assistant', response.content)

  return response.content
}

export async function getAgentConversationMemory(
  agentId: string,
  simulationId: string
): Promise<string> {
  const messages = await prisma.message.findMany({
    where: { 
      simulationId,
      agentId
    },
    orderBy: { timestamp: 'asc' }
  })

  return messages.map(m => m.content).join('\n\n')
}
