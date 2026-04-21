import { Router, Response } from 'express'
import { createSimulation } from '../services/simulation.service'
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware'

const router = Router()

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { description } = req.body
    const userId = req.userId

    if (!description) {
      return res.status(400).json({ error: 'Description is required' })
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID is missing from token' })
    }

    const simulationId = await createSimulation({ 
      idea: description,
      userId: userId
    })

    res.status(201).json({ id: simulationId })
  } catch (error) {
    console.error('Error creating idea:', error)
    res.status(500).json({ error: 'Failed to create idea' })
  }
})

export default router
