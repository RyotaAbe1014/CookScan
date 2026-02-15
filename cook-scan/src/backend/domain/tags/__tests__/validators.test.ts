import { describe, it, expect } from 'vitest'
import {
  createTagCategoryInputSchema,
  updateTagCategoryInputSchema,
  createTagInputSchema,
  updateTagInputSchema,
} from '../validators'

const str = (n: number) => 'あ'.repeat(n)

describe('createTagCategoryInputSchema', () => {
  describe('name', () => {
    it('50文字ちょうどは成功する', () => {
      const result = createTagCategoryInputSchema.safeParse({ name: str(50) })
      expect(result.success).toBe(true)
    })

    it('51文字は失敗する', () => {
      const result = createTagCategoryInputSchema.safeParse({ name: str(51) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('カテゴリ名は50文字以内で入力してください')
      }
    })
  })

  describe('description', () => {
    it('200文字ちょうどは成功する', () => {
      const result = createTagCategoryInputSchema.safeParse({ name: 'テスト', description: str(200) })
      expect(result.success).toBe(true)
    })

    it('201文字は失敗する', () => {
      const result = createTagCategoryInputSchema.safeParse({ name: 'テスト', description: str(201) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const descError = result.error.issues.find((i) => i.path.includes('description'))
        expect(descError?.message).toBe('説明は200文字以内で入力してください')
      }
    })
  })
})

describe('updateTagCategoryInputSchema', () => {
  const base = { categoryId: 'cat-1', name: 'テスト' }

  describe('name', () => {
    it('50文字ちょうどは成功する', () => {
      const result = updateTagCategoryInputSchema.safeParse({ ...base, name: str(50) })
      expect(result.success).toBe(true)
    })

    it('51文字は失敗する', () => {
      const result = updateTagCategoryInputSchema.safeParse({ ...base, name: str(51) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const nameError = result.error.issues.find((i) => i.path.includes('name'))
        expect(nameError?.message).toBe('カテゴリ名は50文字以内で入力してください')
      }
    })
  })

  describe('description', () => {
    it('200文字ちょうどは成功する', () => {
      const result = updateTagCategoryInputSchema.safeParse({ ...base, description: str(200) })
      expect(result.success).toBe(true)
    })

    it('201文字は失敗する', () => {
      const result = updateTagCategoryInputSchema.safeParse({ ...base, description: str(201) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const descError = result.error.issues.find((i) => i.path.includes('description'))
        expect(descError?.message).toBe('説明は200文字以内で入力してください')
      }
    })
  })
})

describe('createTagInputSchema', () => {
  const base = { categoryId: 'cat-1', name: 'テスト' }

  describe('name', () => {
    it('50文字ちょうどは成功する', () => {
      const result = createTagInputSchema.safeParse({ ...base, name: str(50) })
      expect(result.success).toBe(true)
    })

    it('51文字は失敗する', () => {
      const result = createTagInputSchema.safeParse({ ...base, name: str(51) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const nameError = result.error.issues.find((i) => i.path.includes('name'))
        expect(nameError?.message).toBe('タグ名は50文字以内で入力してください')
      }
    })
  })

  describe('description', () => {
    it('200文字ちょうどは成功する', () => {
      const result = createTagInputSchema.safeParse({ ...base, description: str(200) })
      expect(result.success).toBe(true)
    })

    it('201文字は失敗する', () => {
      const result = createTagInputSchema.safeParse({ ...base, description: str(201) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const descError = result.error.issues.find((i) => i.path.includes('description'))
        expect(descError?.message).toBe('説明は200文字以内で入力してください')
      }
    })
  })
})

describe('updateTagInputSchema', () => {
  const base = { tagId: 'tag-1', name: 'テスト' }

  describe('name', () => {
    it('50文字ちょうどは成功する', () => {
      const result = updateTagInputSchema.safeParse({ ...base, name: str(50) })
      expect(result.success).toBe(true)
    })

    it('51文字は失敗する', () => {
      const result = updateTagInputSchema.safeParse({ ...base, name: str(51) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const nameError = result.error.issues.find((i) => i.path.includes('name'))
        expect(nameError?.message).toBe('タグ名は50文字以内で入力してください')
      }
    })
  })

  describe('description', () => {
    it('200文字ちょうどは成功する', () => {
      const result = updateTagInputSchema.safeParse({ ...base, description: str(200) })
      expect(result.success).toBe(true)
    })

    it('201文字は失敗する', () => {
      const result = updateTagInputSchema.safeParse({ ...base, description: str(201) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const descError = result.error.issues.find((i) => i.path.includes('description'))
        expect(descError?.message).toBe('説明は200文字以内で入力してください')
      }
    })
  })
})
