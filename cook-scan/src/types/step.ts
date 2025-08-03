export type Step = {
  id: string
  recipeId: string
  orderIndex: number
  instruction: string
  timerSeconds?: number
  createdAt: Date
  updatedAt: Date
}
