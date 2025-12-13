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
    timerSeconds?: number
  }[]
  memo?: string
  tags: string[]
}

export type CreateRecipeRequest = {
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
    timerSeconds?: number
  }[]
  memo?: string
  tags: string[]
}

export type ExtractResponse =
  | { success: true; result: ExtractedRecipeData }
  | { success: false; error: string }