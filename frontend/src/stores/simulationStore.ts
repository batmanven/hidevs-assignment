import { create } from 'zustand'
import type {
  Simulation,
  SimulationResults,
  AgentMessage,
  Agent
} from '../types'
import { api } from '../utils/api'

type SimulationStatus = 'idle' | 'running' | 'completed' | 'failed'

interface SimulationState {
  currentSimulation: Simulation | null
  messages: AgentMessage[]
  agents: Agent[]
  results: SimulationResults | null
  status: SimulationStatus
  progress: number
  isLoading: boolean
  error: string | null

  createSimulation: (description: string) => Promise<string>
  setSimulation: (simulation: Simulation) => void
  addMessage: (message: AgentMessage) => void
  setAgents: (agents: Agent[]) => void
  setResults: (results: SimulationResults) => void
  setStatus: (status: SimulationStatus) => void
  setProgress: (progress: number) => void
  reset: () => void
  fetchResults: (id: string) => Promise<void>
}

export const useSimulationStore = create<SimulationState>((set) => ({
  currentSimulation: null,
  messages: [],
  agents: [],
  results: null,
  status: 'idle',
  progress: 0,
  isLoading: false,
  error: null,

  createSimulation: async (description: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.ideas.create({ description })
      set({
        status: 'running',
        isLoading: false,
        messages: [],
        agents: [],
        results: null,
        progress: 0
      })
      return response.id
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to create simulation',
        isLoading: false
      })
      throw err
    }
  },

  setSimulation: (simulation: Simulation) => {
    set({ currentSimulation: simulation })
  },

  addMessage: (message: AgentMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
      progress: Math.min(state.progress + 10, 90)
    }))
  },

  setAgents: (agents: Agent[]) => {
    set({ agents })
  },

  setResults: (results: SimulationResults) => {
    set({ results, status: 'completed', progress: 100 })
  },

  setStatus: (status: SimulationStatus) => {
    set({ status })
  },

  setProgress: (progress: number) => {
    set({ progress })
  },

  reset: () => {
    set({
      currentSimulation: null,
      messages: [],
      agents: [],
      results: null,
      status: 'idle',
      progress: 0,
      error: null
    })
  },

  fetchResults: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const results = await api.simulations.getResults(id)
      set({ results, isLoading: false, status: 'completed' })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch results',
        isLoading: false
      })
      throw err
    }
  }
}))
