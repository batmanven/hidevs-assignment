import { Server as SocketIOServer } from 'socket.io'
import { generateStreamResponse, ClaudeMessage } from './claude.service'

export class StreamingService {
  private io: SocketIOServer

  constructor(io: SocketIOServer) {
    this.io = io
  }

  async streamAgentResponse(
    simulationId: string,
    agentId: string,
    messages: ClaudeMessage[],
    systemPrompt?: string
  ): Promise<void> {
    const room = simulationId

    await generateStreamResponse(
      messages,
      (chunk: string) => {
        this.io.to(room).emit('agent_chunk', {
          agentId,
          chunk,
          timestamp: new Date()
        })
      },
      systemPrompt
    )
  }

  async streamSimulationProgress(
    simulationId: string,
    progress: number,
    message: string
  ): Promise<void> {
    this.io.to(simulationId).emit('simulation_progress', {
      progress,
      message,
      timestamp: new Date()
    })
  }

  emitAgentAction(simulationId: string, agentId: string, content: string): void {
    this.io.to(simulationId).emit('agent_action', {
      agentId,
      content,
      timestamp: new Date()
    })
  }

  emitSimulationStarted(simulationId: string, agents: any[]): void {
    this.io.to(simulationId).emit('simulation_started', {
      agents,
      timestamp: new Date()
    })
  }

  emitSimulationCompleted(simulationId: string, results: any): void {
    this.io.to(simulationId).emit('simulation_completed', {
      results,
      timestamp: new Date()
    })
  }

  emitSimulationFailed(simulationId: string, error: string): void {
    this.io.to(simulationId).emit('simulation_failed', {
      error,
      timestamp: new Date()
    })
  }
}

export let streamingService: StreamingService

export function initStreamingService(io: SocketIOServer): void {
  streamingService = new StreamingService(io)
}
