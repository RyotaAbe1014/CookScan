/**
 * レシピフォームで使用するタグカテゴリの型定義
 */
export type RecipeFormTagCategory = {
  id: string
  name: string
  description: string | null
  tags: Array<{
    id: string
    name: string
    description: string | null
  }>
}
