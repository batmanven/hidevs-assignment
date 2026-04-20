import { prisma } from '../lib/prisma'
import { createAgent, generateAgentResponse, defaultAgents, AgentConfig } from './agent.service'
import { generateResponse, ClaudeMessage } from './claude.service'
import { getContextForIdea } from './rag.service'

export interface SimulationConfig {
  idea: string
  userId?: string
}

export interface SimulationResults {
  successProbability: number
  risks: Array<{ category: string; description: string; severity: 'high' | 'medium' | 'low' }>
  failureScenarios: Array<{ scenario: string; probability: number }>
  suggestions: Array<string>
  timeline: Array<{ phase: string; duration: string; keyMilestones: string[] }>
}

export async function createSimulation(config: SimulationConfig): Promise<string> {
  const idea = await prisma.idea.create({
    data: {
      userId: config.userId || 'default-user',
      description: config.idea,
      structuredData: {
        extractedAt: new Date().toISOString()
      }
    }
  })

  const simulation = await prisma.simulation.create({
    data: {
      ideaId: idea.id,
      status: 'pending'
    }
  })

  return simulation.id
}

export async function startSimulation(
  simulationId: string,
  onProgress: (action: any) => void
): Promise<SimulationResults> {
  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationId },
    include: { idea: true }
  })

  if (!simulation) {
    throw new Error('Simulation not found')
  }

  await prisma.simulation.update({
    where: { id: simulationId },
    data: { status: 'running' }
  })

  const agentIds: string[] = []

  for (const agentConfig of defaultAgents) {
    const agentId = await createAgent(simulationId, agentConfig)
    agentIds.push(agentId)
  }

  onProgress({
    type: 'simulation_started',
    agents: defaultAgents.map(a => ({ role: a.role, persona: a.persona }))
  })

  const conversationHistory: ClaudeMessage[] = []
  const phases = [
    { name: 'Launch & MVP', focus: 'Initial market entry and core value proposition' },
    { name: 'Customer Adoption', focus: 'User growth, retention, and market feedback' },
    { name: 'Competitive Response', focus: 'Reaction from incumbents and defensive strategies' },
    { name: 'Scale & Profitability', focus: 'Operational scaling, unit economics, and long-term viability' }
  ]

  for (const phase of phases) {
    onProgress({
      type: 'phase_started',
      phase: phase.name,
      focus: phase.focus
    })

    for (const agentId of agentIds) {
      const agent = await prisma.agent.findUnique({ where: { id: agentId } })
      
      const phaseContext = `Phase: ${phase.name}. Focus: ${phase.focus}. 
      As ${agent?.role}, analyze how this idea survives and thrives during this stage. 
      Specifically address any concerns or points raised by other agents in the history above.`

      const ragContext = await getContextForIdea(simulation.idea.description)

      const response = await generateAgentResponse(
        agentId,
        simulation.idea.description,
        conversationHistory,
        phaseContext
      )

      onProgress({
        type: 'agent_action',
        id: Math.random().toString(36).substr(2, 9),
        agentId,
        role: agent?.role,
        content: response,
        timestamp: new Date(),
        evidence: ragContext 
      })

      conversationHistory.push({
        role: 'assistant',
        content: `[${agent?.role?.toUpperCase()}]: ${response}`
      })

      
      await new Promise(resolve => setTimeout(resolve, 800))
    }
  }

  const results = await generateResults(simulation.idea.description, conversationHistory)

  await prisma.simulation.update({
    where: { id: simulationId },
    data: {
      status: 'completed',
      results: results as any,
      completedAt: new Date()
    }
  })

  onProgress({
    type: 'simulation_completed',
    results
  })

  return results
}

async function generateResults(
  idea: string,
  conversationHistory: ClaudeMessage[]
): Promise<SimulationResults> {
  const summaryPrompt = `Based on the following simulation discussion about the idea "${idea}", provide:
1. A success probability (0-100)
2. Key risks with severity levels (high/medium/low)
3. Potential failure scenarios with probabilities
4. Actionable suggestions
5. A timeline with phases, durations, and key milestones

Respond in JSON format with this structure:
{
  "successProbability": number,
  "marketSentiment": number, 
  "criticalFriction": string,
  "risks": [{"category": string, "description": string, "severity": "high|medium|low"}],
  "failureScenarios": [{"scenario": string, "probability": number}],
  "suggestions": [string],
  "timeline": [{"phase": string, "duration": string, "keyMilestones": [string]}]
}

Conversation:
${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n\n')}`

  const response = await generateResponse(
    [{ role: 'user', content: summaryPrompt }],
    'You are an expert business analyst. Provide structured, realistic assessments.',
    4096
  )

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error('Failed to parse results JSON:', error)
  }

  return {
    successProbability: 50,
    risks: [
      { category: 'Market', description: 'Uncertain market demand', severity: 'high' },
      { category: 'Competition', description: 'Strong existing competitors', severity: 'medium' },
      { category: 'Operations', description: 'Execution complexity', severity: 'medium' }
    ],
    failureScenarios: [
      { scenario: 'Insufficient customer acquisition', probability: 40 },
      { scenario: 'Competitor price war', probability: 30 },
      { scenario: 'Operational bottlenecks', probability: 25 }
    ],
    suggestions: [
      'Start with MVP to validate market',
      'Focus on niche segment first',
      'Build partnerships with local restaurants',
      'Implement referral program'
    ],
    timeline: [
      { phase: 'Launch', duration: '3 months', keyMilestones: ['MVP development', 'Beta testing', 'Initial launch'] },
      { phase: 'Adoption', duration: '6 months', keyMilestones: ['Marketing campaign', 'User feedback', 'Feature iterations'] },
      { phase: 'Scaling', duration: '12 months', keyMilestones: ['Market expansion', 'Team growth', 'Series A funding'] }
    ]
  }
}

export async function getSimulationResults(simulationId: string): Promise<SimulationResults | null> {
  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationId }
  })

  if (!simulation || !simulation.results) {
    return null
  }

  return simulation.results as unknown as SimulationResults
}

export async function getSimulationStatus(simulationId: string): Promise<string> {
  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationId }
  })

  return simulation?.status || 'unknown'
}
