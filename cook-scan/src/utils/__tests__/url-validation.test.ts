import { describe, it, expect } from 'vitest'
import { isValidHttpUrl, sanitizeUrl } from '../url-validation'

describe('url-validation', () => {
  describe('isValidHttpUrl', () => {
    it('https URLを有効と判定する', () => {
      expect(isValidHttpUrl('https://example.com')).toBe(true)
      expect(isValidHttpUrl('https://example.com/path')).toBe(true)
      expect(isValidHttpUrl('https://example.com/path?query=value')).toBe(true)
    })

    it('http URLを有効と判定する', () => {
      expect(isValidHttpUrl('http://example.com')).toBe(true)
      expect(isValidHttpUrl('http://example.com/path')).toBe(true)
    })

    it('javascript: スキームを無効と判定する', () => {
      expect(isValidHttpUrl('javascript:alert("XSS")')).toBe(false)
      expect(isValidHttpUrl('javascript:void(0)')).toBe(false)
    })

    it('data: スキームを無効と判定する', () => {
      expect(isValidHttpUrl('data:text/html,<script>alert("XSS")</script>')).toBe(false)
    })

    it('その他の危険なスキームを無効と判定する', () => {
      expect(isValidHttpUrl('file:///etc/passwd')).toBe(false)
      expect(isValidHttpUrl('vbscript:msgbox')).toBe(false)
    })

    it('null、undefined、空文字列を無効と判定する', () => {
      expect(isValidHttpUrl(null)).toBe(false)
      expect(isValidHttpUrl(undefined)).toBe(false)
      expect(isValidHttpUrl('')).toBe(false)
    })

    it('無効なURL形式を無効と判定する', () => {
      expect(isValidHttpUrl('not a url')).toBe(false)
      expect(isValidHttpUrl('://invalid')).toBe(false)
    })
  })

  describe('sanitizeUrl', () => {
    it('有効なURLをそのまま返す', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com')
    })

    it('無効なURLにはnullを返す', () => {
      expect(sanitizeUrl('javascript:alert("XSS")')).toBe(null)
      expect(sanitizeUrl('data:text/html,<script>alert("XSS")</script>')).toBe(null)
    })

    it('null、undefined、空文字列にはnullを返す', () => {
      expect(sanitizeUrl(null)).toBe(null)
      expect(sanitizeUrl(undefined)).toBe(null)
      expect(sanitizeUrl('')).toBe(null)
    })
  })
})
