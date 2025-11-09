import { describe, it, expect } from 'vitest'
import { formatDate, truncate, isEmpty } from './format'

describe('formatDate', () => {
  it('should format a date correctly', () => {
    const date = new Date('2025-11-09T00:00:00Z')
    const formatted = formatDate(date)
    expect(formatted).toBeTruthy()
    expect(typeof formatted).toBe('string')
  })
})

describe('truncate', () => {
  it('should truncate long strings', () => {
    const longString = 'This is a very long string that needs to be truncated'
    const result = truncate(longString, 20)
    expect(result).toBe('This is a very long ...')
    expect(result.length).toBe(23) // 20 + '...'
  })

  it('should not truncate short strings', () => {
    const shortString = 'Short'
    const result = truncate(shortString, 20)
    expect(result).toBe('Short')
  })

  it('should handle exact length strings', () => {
    const exactString = 'Exactly 20 chars!123'
    const result = truncate(exactString, 20)
    expect(result).toBe('Exactly 20 chars!123')
  })
})

describe('isEmpty', () => {
  it('should return true for null', () => {
    expect(isEmpty(null)).toBe(true)
  })

  it('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true)
  })

  it('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true)
  })

  it('should return true for whitespace only', () => {
    expect(isEmpty('   ')).toBe(true)
  })

  it('should return false for non-empty string', () => {
    expect(isEmpty('Hello')).toBe(false)
  })

  it('should return false for string with content and whitespace', () => {
    expect(isEmpty('  Hello  ')).toBe(false)
  })
})
