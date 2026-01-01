export type Ingredient = {
  id?: string
  name: string
  unit?: string
  notes?: string
}

export type IngredientInputProps = {
  ingredient: Ingredient
  index: number
  canDelete: boolean
  onUpdate: (index: number, field: 'name' | 'unit' | 'notes', value: string) => void
  onRemove: (index: number) => void
}
