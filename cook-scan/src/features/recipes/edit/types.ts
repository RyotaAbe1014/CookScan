export type UpdateRecipeRequest = {
  recipeId: string
  title: string
  sourceInfo: {
    bookName: string
    pageNumber: string
    url?: string
  } | null
  ingredients: {
    id?: string // 既存の材料の場合は ID が含まれる
    name: string
    unit?: string
    notes?: string
  }[]
  steps: {
    id?: string // 既存の手順の場合は ID が含まれる
    instruction: string
    timerSeconds?: number
    orderIndex: number
  }[]
  memo?: string
  tags: string[]
}

export type UpdateRecipeResponse = {
  success: boolean
  recipeId?: string
  error?: string
}