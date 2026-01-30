/**
 * Recipe Domain Types
 * ドメイン層の型定義
 */

import type { Ingredient } from '@/types/ingredient'
import type { Step } from '@/types/step'
import type { SourceInfo } from '@/types/sourceInfo'

// ===== Input Types (リクエスト用) =====

/** 材料の入力型 */
export type IngredientInput = {
  name: string
  unit?: string
  notes?: string
}

/** 手順の入力型 */
export type StepInput = {
  instruction: string
  timerSeconds?: number
  orderIndex?: number
}

/** ソース情報の入力型 */
export type SourceInfoInput = {
  bookName?: string
  pageNumber?: string
  url?: string
}

/** レシピ作成用の入力型 */
export type CreateRecipeInput = {
  title: string
  sourceInfo: SourceInfoInput | null
  ingredients: IngredientInput[]
  steps: StepInput[]
  memo?: string
  tags: string[]
}

/** レシピ更新用の入力型 */
export type UpdateRecipeInput = {
  recipeId: string
  title: string
  sourceInfo: SourceInfoInput | null
  ingredients: IngredientInput[]
  steps: Array<StepInput & { orderIndex: number }>
  memo?: string
  tags: string[]
}

// ===== Output Types (レスポンス用) =====

/** レシピタグの出力型 */
export type RecipeTagOutput = {
  tagId: string
  recipeId: string
  tag: {
    id: string
    name: string
    description: string | null
    isSystem: boolean
    userId: string | null
    categoryId: string
    category: {
      id: string
      name: string
      description: string | null
      isSystem: boolean
      userId: string | null
    }
  }
}

/** レシピ詳細の出力型 */
export type RecipeDetailOutput = {
  id: string
  userId: string
  title: string
  imageUrl: string | null
  memo: string | null
  createdAt: Date
  updatedAt: Date
  ingredients: Ingredient[]
  steps: Step[]
  recipeTags: RecipeTagOutput[]
  sourceInfo: SourceInfo[]
}

/** レシピ一覧の出力型（簡易版） */
export type RecipeListOutput = {
  id: string
  userId: string
  title: string
  imageUrl: string | null
  memo: string | null
  createdAt: Date
  updatedAt: Date
  ingredients: Ingredient[]
  recipeTags: Array<{
    tagId: string
    recipeId: string
    tag: {
      id: string
      name: string
      description: string | null
      isSystem: boolean
      userId: string | null
      categoryId: string
    }
  }>
}

/** レシピ作成の結果型 */
export type CreateRecipeResult = {
  recipeId: string
}

/** レシピ更新の結果型 */
export type UpdateRecipeResult = {
  recipeId: string
}
