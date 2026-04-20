import { Router } from 'express'
import { startSimulation, getSimulationResults, getSimulationStatus } from '../services/simulation.service'
import { Socket } from 'socket.io'

let io: any

export function setSocketIO(socketIO: any) {
  io = socketIO
}

const router = Router()

router.post('/:id/start', async (req, res) => {
  try {
    const { id } = req.params

    startSimulation(id, (action) => {
      if (io) {
        io.to(id).emit('agent_action', action)
        
        if (action.type === 'simulation_started') {
          io.to(id).emit('simulation_started', action)
        }
        
        if (action.type === 'simulation_completed') {
          io.to(id).emit('simulation_completed', action)
        }
      }
    })

    res.json({ status: 'started' })
  } catch (error) {
    console.error('Error starting simulation:', error)
    res.status(500).json({ error: 'Failed to start simulation' })
  }
})

router.get('/:id/results', async (req, res) => {
  try {
    const { id } = req.params
    const results = await getSimulationResults(id)

    if (!results) {
      return res.status(404).json({ error: 'Results not found' })
    }

    res.json(results)
  } catch (error) {
    console.error('Error getting results:', error)
    res.status(500).json({ error: 'Failed to get results' })
  }
})

router.get('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const status = await getSimulationStatus(id)

    res.json({ status })
  } catch (error) {
    console.error('Error getting status:', error)
    res.status(500).json({ error: 'Failed to get status' })
  }
})

export default router
