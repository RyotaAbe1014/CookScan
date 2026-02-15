import { describe, it, expect } from 'vitest'
import {
  createShoppingItemInputSchema,
  updateShoppingItemInputSchema,
} from '../validators'

const str = (n: number) => 'あ'.repeat(n)

describe('createShoppingItemInputSchema', () => {
  describe('name', () => {
    it('100文字ちょうどは成功する', () => {
      const result = createShoppingItemInputSchema.safeParse({ name: str(100) })
      expect(result.success).toBe(true)
    })

    it('101文字は失敗する', () => {
      const result = createShoppingItemInputSchema.safeParse({ name: str(101) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('アイテム名は100文字以内で入力してください')
      }
    })
  })

  describe('memo', () => {
    it('500文字ちょうどは成功する', () => {
      const result = createShoppingItemInputSchema.safeParse({ name: 'テスト', memo: str(500) })
      expect(result.success).toBe(true)
    })

    it('501文字は失敗する', () => {
      const result = createShoppingItemInputSchema.safeParse({ name: 'テスト', memo: str(501) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const memoError = result.error.issues.find((i) => i.path.includes('memo'))
        expect(memoError?.message).toBe('メモは500文字以内で入力してください')
      }
    })
  })
})

describe('updateShoppingItemInputSchema', () => {
  const base = { itemId: 'item-1', name: 'テスト' }

  describe('name', () => {
    it('100文字ちょうどは成功する', () => {
      const result = updateShoppingItemInputSchema.safeParse({ ...base, name: str(100) })
      expect(result.success).toBe(true)
    })

    it('101文字は失敗する', () => {
      const result = updateShoppingItemInputSchema.safeParse({ ...base, name: str(101) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const nameError = result.error.issues.find((i) => i.path.includes('name'))
        expect(nameError?.message).toBe('アイテム名は100文字以内で入力してください')
      }
    })
  })

  describe('memo', () => {
    it('500文字ちょうどは成功する', () => {
      const result = updateShoppingItemInputSchema.safeParse({ ...base, memo: str(500) })
      expect(result.success).toBe(true)
    })

    it('501文字は失敗する', () => {
      const result = updateShoppingItemInputSchema.safeParse({ ...base, memo: str(501) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const memoError = result.error.issues.find((i) => i.path.includes('memo'))
        expect(memoError?.message).toBe('メモは500文字以内で入力してください')
      }
    })
  })
})
