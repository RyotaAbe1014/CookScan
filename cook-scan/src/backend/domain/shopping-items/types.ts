/**
 * ShoppingItem Domain Types
 * ドメイン層の型定義
 */

// ===== Input Types =====

/** 買い物アイテム作成用の入力型 */
export type CreateShoppingItemInput = {
  name: string
  memo?: string
}

/** 買い物アイテム一括作成用の入力型 */
export type CreateShoppingItemsInput = {
  items: { name: string; memo?: string }[]
}

/** 買い物アイテム更新用の入力型 */
export type UpdateShoppingItemInput = {
  itemId: string
  name: string
  memo?: string
}

/** 買い物アイテムのチェック状態更新用の入力型 */
export type UpdateShoppingItemCheckInput = {
  itemId: string
  isChecked: boolean
}

/** 買い物アイテムの並び順更新用の入力型 */
export type ReorderShoppingItemsInput = {
  itemIds: string[]
}

// ===== Output Types =====

/** 買い物アイテムの出力型 */
export type ShoppingItemOutput = {
  id: string
  userId: string
  name: string
  memo: string | null
  isChecked: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

// ===== Result Types =====

/** 買い物アイテム作成の結果型 */
export type CreateShoppingItemResult = {
  itemId: string
}
