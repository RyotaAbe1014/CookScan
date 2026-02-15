import { describe, it, expect } from 'vitest'
import { stepInputSchema } from '../validators'

describe('stepInputSchema', () => {
  describe('timerSeconds validation', () => {
    it('should accept positive timer values', () => {
      const validStep = {
        instruction: '煮込む',
        timerSeconds: 300,
      }
      const result = stepInputSchema.safeParse(validStep)
      expect(result.success).toBe(true)
    })

    it('should accept undefined timerSeconds (optional)', () => {
      const validStep = {
        instruction: '煮込む',
      }
      const result = stepInputSchema.safeParse(validStep)
      expect(result.success).toBe(true)
    })

    it('should reject zero timerSeconds', () => {
      const invalidStep = {
        instruction: '煮込む',
        timerSeconds: 0,
      }
      const result = stepInputSchema.safeParse(invalidStep)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['timerSeconds'])
      }
    })

    it('should reject negative timerSeconds', () => {
      const invalidStep = {
        instruction: '煮込む',
        timerSeconds: -60,
      }
      const result = stepInputSchema.safeParse(invalidStep)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['timerSeconds'])
      }
    })

    it('should reject non-finite timerSeconds (Infinity)', () => {
      const invalidStep = {
        instruction: '煮込む',
        timerSeconds: Infinity,
      }
      const result = stepInputSchema.safeParse(invalidStep)
      expect(result.success).toBe(false)
    })

    it('should reject non-finite timerSeconds (NaN)', () => {
      const invalidStep = {
        instruction: '煮込む',
        timerSeconds: NaN,
      }
      const result = stepInputSchema.safeParse(invalidStep)
      expect(result.success).toBe(false)
    })
  })
})
