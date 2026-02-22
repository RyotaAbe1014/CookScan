// Prismaスキーマに基づいた完全なIngredient型
export type Ingredient = {
  id: string
  recipeId: string
  name: string
  unit: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}
