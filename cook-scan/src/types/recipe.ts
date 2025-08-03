export type Recipe = {
  id: string
  userId: string
  title: string
  parentRecipeId?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}
