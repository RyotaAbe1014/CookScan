import { describe, it, expect } from 'vitest'
import {
  ingredientInputSchema,
  stepInputSchema,
  sourceInfoInputSchema,
  createRecipeInputSchema,
  updateRecipeInputSchema,
} from '../validators'

// ヘルパー: 指定文字数の文字列を生成
const str = (n: number) => 'あ'.repeat(n)

// 有効なレシピ入力のベースデータ
const validRecipeBase = {
  title: 'テストレシピ',
  sourceInfo: null,
  ingredients: [{ name: '卵' }],
  steps: [{ instruction: '焼く' }],
  memo: undefined,
  tags: [],
}

describe('ingredientInputSchema', () => {
  describe('name', () => {
    it('100文字ちょうどは成功する', () => {
      const result = ingredientInputSchema.safeParse({ name: str(100) })
      expect(result.success).toBe(true)
    })

    it('101文字は失敗する', () => {
      const result = ingredientInputSchema.safeParse({ name: str(101) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('材料名は100文字以内で入力してください')
      }
    })
  })

  describe('unit', () => {
    it('50文字ちょうどは成功する', () => {
      const result = ingredientInputSchema.safeParse({ name: '塩', unit: str(50) })
      expect(result.success).toBe(true)
    })

    it('51文字は失敗する', () => {
      const result = ingredientInputSchema.safeParse({ name: '塩', unit: str(51) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('単位は50文字以内で入力してください')
      }
    })
  })

  describe('notes', () => {
    it('200文字ちょうどは成功する', () => {
      const result = ingredientInputSchema.safeParse({ name: '塩', notes: str(200) })
      expect(result.success).toBe(true)
    })

    it('201文字は失敗する', () => {
      const result = ingredientInputSchema.safeParse({ name: '塩', notes: str(201) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('メモは200文字以内で入力してください')
      }
    })
  })
})

describe('stepInputSchema', () => {
  describe('instruction', () => {
    it('1000文字ちょうどは成功する', () => {
      const result = stepInputSchema.safeParse({ instruction: str(1000) })
      expect(result.success).toBe(true)
    })

    it('1001文字は失敗する', () => {
      const result = stepInputSchema.safeParse({ instruction: str(1001) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('手順は1000文字以内で入力してください')
      }
    })
  })

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

describe('sourceInfoInputSchema', () => {
  describe('bookName', () => {
    it('200文字ちょうどは成功する', () => {
      const result = sourceInfoInputSchema.safeParse({ bookName: str(200) })
      expect(result.success).toBe(true)
    })

    it('201文字は失敗する', () => {
      const result = sourceInfoInputSchema.safeParse({ bookName: str(201) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('書籍名は200文字以内で入力してください')
      }
    })
  })

  describe('pageNumber', () => {
    it('20文字ちょうどは成功する', () => {
      const result = sourceInfoInputSchema.safeParse({ pageNumber: str(20) })
      expect(result.success).toBe(true)
    })

    it('21文字は失敗する', () => {
      const result = sourceInfoInputSchema.safeParse({ pageNumber: str(21) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('ページ番号は20文字以内で入力してください')
      }
    })
  })

  describe('url', () => {
    it('2000文字ちょうどは成功する', () => {
      const result = sourceInfoInputSchema.safeParse({ url: str(2000) })
      expect(result.success).toBe(true)
    })

    it('2001文字は失敗する', () => {
      const result = sourceInfoInputSchema.safeParse({ url: str(2001) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('URLは2000文字以内で入力してください')
      }
    })
  })
})

describe('createRecipeInputSchema', () => {
  describe('title', () => {
    it('100文字ちょうどは成功する', () => {
      const result = createRecipeInputSchema.safeParse({ ...validRecipeBase, title: str(100) })
      expect(result.success).toBe(true)
    })

    it('101文字は失敗する', () => {
      const result = createRecipeInputSchema.safeParse({ ...validRecipeBase, title: str(101) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const titleError = result.error.issues.find((i) => i.path.includes('title'))
        expect(titleError?.message).toBe('タイトルは100文字以内で入力してください')
      }
    })
  })

  describe('memo', () => {
    it('1000文字ちょうどは成功する', () => {
      const result = createRecipeInputSchema.safeParse({ ...validRecipeBase, memo: str(1000) })
      expect(result.success).toBe(true)
    })

    it('1001文字は失敗する', () => {
      const result = createRecipeInputSchema.safeParse({ ...validRecipeBase, memo: str(1001) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const memoError = result.error.issues.find((i) => i.path.includes('memo'))
        expect(memoError?.message).toBe('メモは1000文字以内で入力してください')
      }
    })
  })
})

describe('updateRecipeInputSchema', () => {
  const validUpdateBase = { ...validRecipeBase, recipeId: 'recipe-1', steps: [{ instruction: '焼く', orderIndex: 0 }] }

  describe('title', () => {
    it('100文字ちょうどは成功する', () => {
      const result = updateRecipeInputSchema.safeParse({ ...validUpdateBase, title: str(100) })
      expect(result.success).toBe(true)
    })

    it('101文字は失敗する', () => {
      const result = updateRecipeInputSchema.safeParse({ ...validUpdateBase, title: str(101) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const titleError = result.error.issues.find((i) => i.path.includes('title'))
        expect(titleError?.message).toBe('タイトルは100文字以内で入力してください')
      }
    })
  })

  describe('memo', () => {
    it('1000文字ちょうどは成功する', () => {
      const result = updateRecipeInputSchema.safeParse({ ...validUpdateBase, memo: str(1000) })
      expect(result.success).toBe(true)
    })

    it('1001文字は失敗する', () => {
      const result = updateRecipeInputSchema.safeParse({ ...validUpdateBase, memo: str(1001) })
      expect(result.success).toBe(false)
      if (!result.success) {
        const memoError = result.error.issues.find((i) => i.path.includes('memo'))
        expect(memoError?.message).toBe('メモは1000文字以内で入力してください')
      }
    })
  })
})
