/**
 * Tag Domain Types
 * ドメイン層の型定義
 */

// ===== Input Types =====

/** タグカテゴリ作成用の入力型 */
export type CreateTagCategoryInput = {
  name: string
  description?: string
}

/** タグ作成用の入力型 */
export type CreateTagInput = {
  categoryId: string
  name: string
  description?: string
}

/** タグ更新用の入力型 */
export type UpdateTagInput = {
  tagId: string
  name: string
  description?: string
}

/** タグカテゴリ更新用の入力型 */
export type UpdateTagCategoryInput = {
  categoryId: string
  name: string
  description?: string
}

// ===== Output Types =====

/** レシピ用のタグ選択データ */
export type TagsForRecipeOutput = Array<{
  id: string
  name: string
  description: string | null
  isSystem: boolean
  tags: Array<{
    id: string
    name: string
    description: string | null
  }>
}>

/** タグページ用のデータ */
export type TagCategoriesWithTagsOutput = {
  tagCategories: Array<{
    id: string
    name: string
    description: string | null
    isSystem: boolean
    userId: string | null
    tags: Array<{
      id: string
      name: string
      description: string | null
      isSystem: boolean
      userId: string | null
      categoryId: string
      recipeTags: Array<{ recipeId: string }>
    }>
  }>
}

// ===== Result Types =====

/** タグカテゴリ作成の結果型 */
export type CreateTagCategoryResult = {
  categoryId: string
}

/** タグ作成の結果型 */
export type CreateTagResult = {
  tagId: string
}
