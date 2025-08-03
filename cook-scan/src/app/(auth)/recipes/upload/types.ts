export type ExtractedRecipeData = {
  title: string
  sourceInfo: {
    bookName: string
    pageNumber: string
    url?: string
  } | null
  ingredients: {
    name: string
    unit?: string
    notes?: string
  }[]
  steps: {
    instruction: string
    timerMinutes?: number
    order: number
  }[]
  tags: string[]
}