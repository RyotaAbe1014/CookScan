/**
 * MealPlan Domain Types
 * ドメイン層の型定義
 */

// ===== Output Types =====

/** 献立プランアイテムのレシピ情報 */
export type MealPlanRecipeOutput = {
  id: string
  title: string
  imageUrl: string | null
  ingredients: Array<{
    id: string
    name: string
    unit: string | null
    notes: string | null
  }>
}

/** 献立プランアイテムの出力型 */
export type MealPlanItemOutput = {
  id: string
  dayOfWeek: number
  recipe: MealPlanRecipeOutput
}

/** 献立プランの出力型 */
export type MealPlanOutput = {
  id: string
  weekStart: Date
  items: MealPlanItemOutput[]
}

// ===== Input Types =====

/** 献立プランアイテム追加用の入力型 */
export type AddMealPlanItemInput = {
  weekStart: string
  dayOfWeek: number
  recipeId: string
}

/** 献立プランアイテム削除用の入力型 */
export type RemoveMealPlanItemInput = {
  itemId: string
}

/** 買い物リスト生成用の入力型 */
export type GenerateShoppingListInput = {
  weekStart: string
}
