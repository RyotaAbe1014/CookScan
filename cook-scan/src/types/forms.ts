/**
 * フォーム用の共通型定義
 * レシピ作成・編集フォームで使用される型
 */

// ソース情報のフォーム入力用型
export type SourceInfoFormData = {
  bookName: string
  pageNumber: string
  url?: string
}

// 材料のフォーム入力用型
export type IngredientFormData = {
  id?: string // 既存の材料の場合は ID が含まれる
  name: string
  unit?: string
  notes?: string
}

// 手順のフォーム入力用型
export type StepFormData = {
  id?: string // 既存の手順の場合は ID が含まれる
  instruction: string
  timerSeconds?: number
  orderIndex?: number
}

// レシピ作成リクエスト型
export type CreateRecipeRequest = {
  title: string
  sourceInfo: SourceInfoFormData | null
  ingredients: IngredientFormData[]
  steps: StepFormData[]
  memo?: string
  tags: string[]
}

// レシピ更新リクエスト型
export type UpdateRecipeRequest = {
  recipeId: string
  title: string
  sourceInfo: SourceInfoFormData | null
  ingredients: IngredientFormData[]
  steps: Array<StepFormData & { orderIndex: number }>
  memo?: string
  tags: string[]
}

// AI抽出結果の型
export type ExtractedRecipeData = {
  title: string
  sourceInfo: SourceInfoFormData | null
  ingredients: IngredientFormData[]
  steps: StepFormData[]
  memo?: string
  tags: string[]
}

// 抽出APIのレスポンス型
export type ExtractResponse =
  | { success: true; result: ExtractedRecipeData }
  | { success: false; error: string }

// 更新APIのレスポンス型
export type UpdateRecipeResponse = {
  success: boolean
  recipeId?: string
  error?: string
}
