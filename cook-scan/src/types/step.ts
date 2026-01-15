// Prismaスキーマに基づいた完全なStep型
export type Step = {
  id: string
  recipeId: string
  orderIndex: number
  instruction: string
  timerSeconds: number | null
  createdAt: Date
  updatedAt: Date
}

// UI表示用のStep型（一部のフィールドのみ）
export type StepDisplay = {
  id: string
  orderIndex: number
  instruction: string
  timerSeconds: number | null
}
