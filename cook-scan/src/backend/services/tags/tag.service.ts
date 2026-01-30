/**
 * Tag Service
 * ビジネスロジック
 */

import * as TagRepository from '@/backend/repositories/tag.repository'
import type {
  CreateTagCategoryInput,
  CreateTagInput,
  UpdateTagInput,
  UpdateTagCategoryInput,
  CreateTagCategoryResult,
  CreateTagResult,
  TagsForRecipeOutput,
  TagCategoriesWithTagsOutput,
} from '@/backend/domain/tags'

// ===== Tag Category Services =====

/**
 * タグカテゴリを作成
 */
export async function createTagCategory(
  userId: string,
  input: CreateTagCategoryInput
): Promise<CreateTagCategoryResult> {
  const { name, description } = input

  const category = await TagRepository.createTagCategory(userId, name, description)

  return { categoryId: category.id }
}

/**
 * タグカテゴリを更新
 */
export async function updateTagCategory(
  userId: string,
  input: UpdateTagCategoryInput
): Promise<void> {
  const { categoryId, name, description } = input

  // カテゴリの存在と権限を確認
  const category = await TagRepository.findTagCategoryById(categoryId)

  if (!category) {
    throw new Error('カテゴリが見つかりません')
  }

  // システムカテゴリは編集不可
  if (category.isSystem) {
    throw new Error('システムカテゴリは編集できません')
  }

  // 自分のカテゴリのみ編集可能
  if (category.userId !== userId) {
    throw new Error('このカテゴリを編集する権限がありません')
  }

  await TagRepository.updateTagCategory(categoryId, name, description)
}

/**
 * タグカテゴリを削除
 */
export async function deleteTagCategory(userId: string, categoryId: string): Promise<void> {
  // カテゴリの存在と権限を確認
  const category = await TagRepository.findTagCategoryById(categoryId)

  if (!category) {
    throw new Error('カテゴリが見つかりません')
  }

  // システムカテゴリは削除不可
  if (category.isSystem) {
    throw new Error('システムカテゴリは削除できません')
  }

  // 自分のカテゴリのみ削除可能
  if (category.userId !== userId) {
    throw new Error('このカテゴリを削除する権限がありません')
  }

  // タグが存在する場合は削除不可
  if (category.tags && category.tags.length > 0) {
    throw new Error(`このカテゴリには${category.tags.length}個のタグがあるため削除できません`)
  }

  await TagRepository.deleteTagCategory(categoryId)
}

// ===== Tag Services =====

/**
 * タグを作成
 */
export async function createTag(userId: string, input: CreateTagInput): Promise<CreateTagResult> {
  const { categoryId, name, description } = input

  // カテゴリの存在と権限を確認
  const category = await TagRepository.findTagCategoryById(categoryId)

  if (!category) {
    throw new Error('カテゴリが見つかりません')
  }

  // システムカテゴリ、または自分のカテゴリのみタグを作成可能
  if (!category.isSystem && category.userId !== userId) {
    throw new Error('このカテゴリにタグを作成する権限がありません')
  }

  const tag = await TagRepository.createTag(categoryId, userId, name, description)

  return { tagId: tag.id }
}

/**
 * タグを更新
 */
export async function updateTag(userId: string, input: UpdateTagInput): Promise<void> {
  const { tagId, name, description } = input

  // タグの存在と権限を確認
  const tag = await TagRepository.findTagById(tagId)

  if (!tag) {
    throw new Error('タグが見つかりません')
  }

  // システムタグは編集不可
  if (tag.isSystem) {
    throw new Error('システムタグは編集できません')
  }

  // 自分が作成したタグのみ編集可能
  if (tag.userId !== userId) {
    throw new Error('このタグを編集する権限がありません')
  }

  await TagRepository.updateTag(tagId, name, description)
}

/**
 * タグを削除
 */
export async function deleteTag(userId: string, tagId: string): Promise<void> {
  // タグの存在と権限を確認
  const tag = await TagRepository.findTagById(tagId)

  if (!tag) {
    throw new Error('タグが見つかりません')
  }

  // システムタグは削除不可
  if (tag.isSystem) {
    throw new Error('システムタグは削除できません')
  }

  // 自分が作成したタグのみ削除可能
  if (tag.userId !== userId) {
    throw new Error('このタグを削除する権限がありません')
  }

  await TagRepository.deleteTag(tagId)
}

// ===== Tag Retrieval Services =====

/**
 * レシピ作成・編集用のタグ一覧を取得
 */
export async function getAllTagsForRecipe(userId: string): Promise<TagsForRecipeOutput> {
  return TagRepository.findTagCategoriesByUser(userId)
}

/**
 * タグページ用のタグカテゴリとタグ、レシピタグの関連を取得
 */
export async function getTagCategoriesWithTags(
  userId: string
): Promise<TagCategoriesWithTagsOutput> {
  const tagCategories = await TagRepository.findTagCategoriesWithRecipeTags(userId)

  return { tagCategories }
}
