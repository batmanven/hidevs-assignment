import { Router } from 'express'
import { createSimulation } from '../services/simulation.service'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { description } = req.body

    if (!description) {
      return res.status(400).json({ error: 'Description is required' })
    }

    const simulationId = await createSimulation({ idea: description })

    res.status(201).json({ id: simulationId })
  } catch (error) {
    console.error('Error creating idea:', error)
    res.status(500).json({ error: 'Failed to create idea' })
  }
})

export default router
