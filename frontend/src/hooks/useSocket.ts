
import { useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSimulationStore } from '../stores'
import type { AgentMessage, Agent } from '../types'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

export function useSocket(simulationId: string | undefined) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const {
    setAgents,
    addMessage,
    setStatus,
    setProgress
  } = useSimulationStore()

  const handleSimulationStarted = useCallback((data: { agents: Agent[] }) => {
    setAgents(data.agents)
  }, [setAgents])

  const handleAgentAction = useCallback((data: AgentMessage) => {
    addMessage({
      ...data,
      timestamp: new Date(data.timestamp)
    })
    setProgress(Math.min(useSimulationStore.getState().progress + 10, 90))
  }, [addMessage, setProgress])

  const handleSimulationCompleted = useCallback(() => {
    setStatus('completed')
    setProgress(100)
  }, [setStatus, setProgress])

  const handleSimulationFailed = useCallback(() => {
    setStatus('failed')
  }, [setStatus])

  useEffect(() => {
    if (!simulationId) return

    const socket = io(SOCKET_URL)
    setSocket(socket)

    socket.emit('join_simulation', simulationId)

    socket.on('simulation_started', handleSimulationStarted)
    socket.on('agent_action', handleAgentAction)
    socket.on('simulation_completed', handleSimulationCompleted)
    socket.on('simulation_failed', handleSimulationFailed)

    return () => {
      socket.disconnect()
      setSocket(null)
    }
  }, [
    simulationId,
    handleSimulationStarted,
    handleAgentAction,
    handleSimulationCompleted,
    handleSimulationFailed
  ])

  return socket
}
