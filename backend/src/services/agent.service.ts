import { prisma } from '../lib/prisma'
import { generateResponse, ClaudeMessage, agentPrompts } from './claude.service'
import { getContextForIdea } from './rag.service'

export interface AgentConfig {
  role: 'customer' | 'competitor' | 'investor' | 'operations'
  persona: string
  memory: Record<string, any>
}

export interface AgentAction {
  agentId: string
  role: string
  content: string
  timestamp: Date
}

export async function createAgent(
  simulationId: string,
  config: AgentConfig
): Promise<string> {
  const agent = await prisma.agent.create({
    data: {
      simulationId,
      role: config.role,
      persona: config.persona,
      memory: config.memory
    }
  })

  return agent.id
}

export async function getAgentsForSimulation(
  simulationId: string
): Promise<AgentConfig[]> {
  const agents = await prisma.agent.findMany({
    where: { simulationId }
  })

  return agents.map(agent => ({
    role: agent.role as AgentConfig['role'],
    persona: agent.persona,
    memory: (agent.memory as Record<string, any>) || {}
  }))
}

export async function generateAgentResponse(
  agentId: string,
  idea: string,
  conversationHistory: ClaudeMessage[],
  additionalContext?: string
): Promise<string> {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId }
  })

  if (!agent) {
    throw new Error('Agent not found')
  }

  const ragContext = await getContextForIdea(idea)
  const systemPrompt = agentPrompts[agent.role as keyof typeof agentPrompts]

  const contextMessage = additionalContext 
    ? `\n\nAdditional Context: ${additionalContext}` 
    : ''

  const messages: ClaudeMessage[] = [
    {
      role: 'user',
      content: `Idea: ${idea}\n\n${ragContext}${contextMessage}\n\nConversation History:\n${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n\n')}\n\nProvide your response as ${agent.role}.`
    }
  ]

  const response = await generateResponse(messages, systemPrompt, 2048)

  await prisma.message.create({
    data: {
      simulationId: agent.simulationId,
      agentId: agent.id,
      content: response.content
    }
  })

  await updateAgentMemory(agentId, { lastResponse: response.content })

  return response.content
}

async function updateAgentMemory(agentId: string, newMemory: Record<string, any>): Promise<void> {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId }
  })

  if (!agent) return

  const currentMemory = (agent.memory as Record<string, any>) || {}
  const updatedMemory = { ...currentMemory, ...newMemory }

  await prisma.agent.update({
    where: { id: agentId },
    data: { memory: updatedMemory }
  })
}

export async function getAgentMemory(agentId: string): Promise<Record<string, any>> {
  const agent = await prisma.agent.findUnique({
    where: { id: agentId }
  })

  return (agent?.memory as Record<string, any>) || {}
}

export const defaultAgents: AgentConfig[] = [
  {
    role: 'customer',
    persona: 'Price-sensitive college student looking for affordable food options',
    memory: {}
  },
  {
    role: 'competitor',
    persona: 'Established food delivery company executive monitoring market threats',
    memory: {}
  },
  {
    role: 'investor',
    persona: 'Venture capitalist evaluating startup viability and market potential',
    memory: {}
  },
  {
    role: 'operations',
    persona: 'Operations manager assessing logistical feasibility and execution challenges',
    memory: {}
  }
]
