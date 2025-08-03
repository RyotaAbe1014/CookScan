export type Ingredient = {
  id: string
  recipeId: string
  name: string
  unit?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}
