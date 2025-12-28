// Prismaスキーマに基づいた完全なSourceInfo型
export type SourceInfo = {
  id: string
  recipeId: string
  sourceType?: string | null
  sourceName?: string | null
  sourceUrl?: string | null
  pageNumber?: string | null
  createdAt: Date
  updatedAt: Date
}

// UI表示用のSourceInfo型（一部のフィールドのみ）
export type SourceInfoDisplay = {
  sourceName: string | null
  pageNumber: string | null
  sourceUrl: string | null
}