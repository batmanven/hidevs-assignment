import { calculateCosineSimilarity } from '../../services/embedding.service'

describe('Embedding Service', () => {
  describe('calculateCosineSimilarity', () => {
    it('should return 1 for identical vectors', () => {
      const vecA = [1, 2, 3]
      const vecB = [1, 2, 3]
      const similarity = calculateCosineSimilarity(vecA, vecB)
      expect(similarity).toBeCloseTo(1)
    })

    it('should return 0 for orthogonal vectors', () => {
      const vecA = [1, 0]
      const vecB = [0, 1]
      const similarity = calculateCosineSimilarity(vecA, vecB)
      expect(similarity).toBeCloseTo(0)
    })

    it('should return 0 for vectors of different lengths', () => {
      const vecA = [1, 2, 3]
      const vecB = [1, 2]
      const similarity = calculateCosineSimilarity(vecA, vecB)
      expect(similarity).toBe(0)
    })

    it('should return 0 for zero vectors', () => {
      const vecA = [0, 0, 0]
      const vecB = [1, 2, 3]
      const similarity = calculateCosineSimilarity(vecA, vecB)
      expect(similarity).toBe(0)
    })

    it('should calculate similarity correctly for similar vectors', () => {
      const vecA = [1, 2, 3]
      const vecB = [2, 4, 6]
      const similarity = calculateCosineSimilarity(vecA, vecB)
      expect(similarity).toBeCloseTo(1)
    })
  })
})
