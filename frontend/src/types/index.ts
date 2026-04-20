export interface User {
  id: string
  email: string
  createdAt: string
}

export interface Agent {
  id: string
  role: 'customer' | 'competitor' | 'investor' | 'operations' | string
  persona: string
}

export interface AgentMessage {
  id: string
  agentId?: string
  role?: string
  content: string
  timestamp: Date | string
  evidence?: string
}

export interface Risk {
  category: string
  description: string
  severity: 'high' | 'medium' | 'low'
}

export interface FailureScenario {
  scenario: string
  probability: number
}

export interface TimelinePhase {
  phase: string
  duration: string
  keyMilestones: string[]
}

export interface SimulationResults {
  successProbability: number
  marketSentiment: number
  criticalFriction: string
  risks: Risk[]
  failureScenarios: FailureScenario[]
  suggestions: string[]
  timeline: TimelinePhase[]
}

export interface Simulation {
  id: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: string
  agents?: Agent[]
  results?: SimulationResults
}

export interface CreateIdeaRequest {
  description: string
}

export interface CreateIdeaResponse {
  id: string
  status: string
}

export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  userId: string
  message: string
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export type SimulationStatus = 'running' | 'completed' | 'failed'

export interface SimulationEvent {
  type: 'simulation_started' | 'agent_action' | 'simulation_completed' | 'simulation_failed'
  data: unknown
}
