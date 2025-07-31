export type ExtractedRecipeData = {
  title?: string
  sourceInfo?: {
    bookName?: string
    pageNumber?: string
    url?: string
  }
  ingredients?: Array<{
    name: string
    unit?: string
    notes?: string
  }>
  steps?: Array<{
    instruction: string
    timerMinutes?: number
  }>
  tags?: string[]
}