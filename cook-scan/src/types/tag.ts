/**
 * タグ関連の共通型定義
 */

// タグの基本型
export type Tag = {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  categoryId: string
}

// タグカテゴリの基本型
export type TagCategory = {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  userId: string | null
}

// タグ一覧を含むカテゴリ型（ページ表示用）
export type TagCategoryWithTags = TagCategory & {
  tags: Array<Tag & {
    recipeTags: Array<{ recipeId: string }>
  }>
}

// セレクトボックス等で使用するシンプルなカテゴリ型
export type TagCategoryBasic = Pick<TagCategory, 'id' | 'name' | 'description' | 'isSystem'>

// レシピに紐付いたタグの型
export type RecipeTagWithDetails = {
  tagId: string
  tag: {
    id: string
    name: string
    category: {
      id: string
      name: string
    }
  }
}
