import type { Ingredient } from './ingredient'
import type { Step } from './step'
import type { SourceInfo } from './sourceInfo'

// RecipeTag型（リレーションを含む）
export type RecipeTag = {
  tagId: string
  tag: {
    id: string
    name: string
    category: {
      id: string
      name: string
    }
  }
}

// 子レシピ関係型
export type ChildRecipeRelation = {
  id: string
  childRecipeId: string
  quantity: string | null
  notes: string | null
  createdAt: Date
  childRecipe: { id: string; title: string; imageUrl: string | null }
}

// 親レシピ関係型
export type ParentRecipeRelation = {
  id: string
  parentRecipeId: string
  quantity: string | null
  notes: string | null
  parentRecipe: { id: string; title: string; imageUrl: string | null }
}

// 完全なRecipe型（リレーションを含む）
export type RecipeWithRelations = {
  id: string
  userId: string
  title: string
  parentRecipeId?: string | null
  imageUrl?: string | null
  memo?: string | null
  createdAt: Date
  updatedAt: Date
  ingredients: Ingredient[]
  steps: Step[]
  recipeTags: RecipeTag[]
  sourceInfo: SourceInfo[]
  usedInRecipes: ChildRecipeRelation[]
  usesRecipes: ParentRecipeRelation[]
}

// 簡易Recipe型（リスト表示用）
export type RecipeBasic = {
  id: string
  title: string
  imageUrl: string | null
  createdAt: Date
  ingredients: Array<{ id: string }>
  recipeTags: Array<{
    tagId: string
    tag: {
      id: string
      name: string
    }
  }>
}

// 最小限のRecipe型（アクション用）
export type RecipeMinimal = {
  id: string
  title: string
}

// 後方互換性のため、Recipe型をRecipeWithRelationsのエイリアスとして定義
export type Recipe = RecipeWithRelations
