export type Ingredient = {
  id: string
  name: string
  unit?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type IngredientWithRecipe = Ingredient & {
  recipeId: string
}