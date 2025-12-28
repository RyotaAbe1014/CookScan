// Prismaスキーマに基づいた完全なIngredient型
export type Ingredient = {
  id: string
  recipeId: string
  name: string
  unit?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

// UI表示用のIngredient型（一部のフィールドのみ）
export type IngredientDisplay = {
  id: string
  name: string
  unit: string | null
  notes: string | null
}
