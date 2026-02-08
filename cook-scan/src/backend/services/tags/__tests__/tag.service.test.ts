import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/backend/repositories/tag.repository', () => ({
  createTagCategory: vi.fn(),
  findTagCategoryById: vi.fn(),
  updateTagCategory: vi.fn(),
  deleteTagCategory: vi.fn(),
  findTagCategoriesByUser: vi.fn(),
  findTagCategoriesWithRecipeTags: vi.fn(),
  createTag: vi.fn(),
  findTagById: vi.fn(),
  updateTag: vi.fn(),
  deleteTag: vi.fn(),
}))

import * as TagRepository from '@/backend/repositories/tag.repository'
import {
  createTagCategory,
  updateTagCategory,
  deleteTagCategory,
  createTag,
  updateTag,
  deleteTag,
  getAllTagsForRecipe,
  getTagCategoriesWithTags,
} from '../tag.service'

describe('tag.service', () => {
  const userId = 'user-1'
  const otherUserId = 'user-other'

  const mockCategory = {
    id: 'cat-1',
    name: 'カテゴリ1',
    description: '説明',
    isSystem: false,
    userId,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockSystemCategory = {
    ...mockCategory,
    id: 'cat-system',
    name: 'システムカテゴリ',
    isSystem: true,
    userId: null,
  }

  const mockTag = {
    id: 'tag-1',
    name: 'タグ1',
    description: '説明',
    isSystem: false,
    userId,
    categoryId: 'cat-1',
    category: mockCategory,
    recipeTags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockSystemTag = {
    ...mockTag,
    id: 'tag-system',
    name: 'システムタグ',
    isSystem: true,
    userId: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ===== createTagCategory =====

  describe('createTagCategory', () => {
    it('タグカテゴリを作成し、categoryId を返す', async () => {
      vi.mocked(TagRepository.createTagCategory).mockResolvedValue(mockCategory as any)

      const result = await createTagCategory(userId, {
        name: 'カテゴリ1',
        description: '説明',
      })

      expect(result).toEqual({ categoryId: 'cat-1' })
      expect(TagRepository.createTagCategory).toHaveBeenCalledWith(userId, 'カテゴリ1', '説明')
    })
  })

  // ===== updateTagCategory =====

  describe('updateTagCategory', () => {
    it('自分のカテゴリを更新できる', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(mockCategory as any)
      vi.mocked(TagRepository.updateTagCategory).mockResolvedValue(undefined as any)

      await updateTagCategory(userId, {
        categoryId: 'cat-1',
        name: '更新名',
        description: '更新説明',
      })

      expect(TagRepository.updateTagCategory).toHaveBeenCalledWith('cat-1', '更新名', '更新説明')
    })

    it('カテゴリが見つからない場合はエラーを投げる', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(null)

      await expect(
        updateTagCategory(userId, { categoryId: 'cat-unknown', name: '名前' })
      ).rejects.toThrow('カテゴリが見つかりません')

      expect(TagRepository.updateTagCategory).not.toHaveBeenCalled()
    })

    it('システムカテゴリは編集できない', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(mockSystemCategory as any)

      await expect(
        updateTagCategory(userId, { categoryId: 'cat-system', name: '名前' })
      ).rejects.toThrow('システムカテゴリは編集できません')

      expect(TagRepository.updateTagCategory).not.toHaveBeenCalled()
    })

    it('他ユーザーのカテゴリは編集できない', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(mockCategory as any)

      await expect(
        updateTagCategory(otherUserId, { categoryId: 'cat-1', name: '名前' })
      ).rejects.toThrow('このカテゴリを編集する権限がありません')

      expect(TagRepository.updateTagCategory).not.toHaveBeenCalled()
    })
  })

  // ===== deleteTagCategory =====

  describe('deleteTagCategory', () => {
    it('タグがないカテゴリを削除できる', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(mockCategory as any)
      vi.mocked(TagRepository.deleteTagCategory).mockResolvedValue(undefined as any)

      await deleteTagCategory(userId, 'cat-1')

      expect(TagRepository.deleteTagCategory).toHaveBeenCalledWith('cat-1')
    })

    it('カテゴリが見つからない場合はエラーを投げる', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(null)

      await expect(deleteTagCategory(userId, 'cat-unknown')).rejects.toThrow(
        'カテゴリが見つかりません'
      )

      expect(TagRepository.deleteTagCategory).not.toHaveBeenCalled()
    })

    it('システムカテゴリは削除できない', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(mockSystemCategory as any)

      await expect(deleteTagCategory(userId, 'cat-system')).rejects.toThrow(
        'システムカテゴリは削除できません'
      )

      expect(TagRepository.deleteTagCategory).not.toHaveBeenCalled()
    })

    it('他ユーザーのカテゴリは削除できない', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(mockCategory as any)

      await expect(deleteTagCategory(otherUserId, 'cat-1')).rejects.toThrow(
        'このカテゴリを削除する権限がありません'
      )

      expect(TagRepository.deleteTagCategory).not.toHaveBeenCalled()
    })

    it('タグが存在するカテゴリは削除できない', async () => {
      const categoryWithTags = {
        ...mockCategory,
        tags: [{ id: 'tag-1', name: 'タグ' }],
      }
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(categoryWithTags as any)

      await expect(deleteTagCategory(userId, 'cat-1')).rejects.toThrow(
        'このカテゴリには1個のタグがあるため削除できません'
      )

      expect(TagRepository.deleteTagCategory).not.toHaveBeenCalled()
    })
  })

  // ===== createTag =====

  describe('createTag', () => {
    it('自分のカテゴリにタグを作成できる', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(mockCategory as any)
      vi.mocked(TagRepository.createTag).mockResolvedValue(mockTag as any)

      const result = await createTag(userId, {
        categoryId: 'cat-1',
        name: 'タグ1',
        description: '説明',
      })

      expect(result).toEqual({ tagId: 'tag-1' })
      expect(TagRepository.createTag).toHaveBeenCalledWith('cat-1', userId, 'タグ1', '説明')
    })

    it('システムカテゴリにもタグを作成できる', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(mockSystemCategory as any)
      vi.mocked(TagRepository.createTag).mockResolvedValue(mockTag as any)

      const result = await createTag(userId, {
        categoryId: 'cat-system',
        name: 'タグ1',
      })

      expect(result).toEqual({ tagId: 'tag-1' })
    })

    it('カテゴリが見つからない場合はエラーを投げる', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(null)

      await expect(
        createTag(userId, { categoryId: 'cat-unknown', name: 'タグ' })
      ).rejects.toThrow('カテゴリが見つかりません')

      expect(TagRepository.createTag).not.toHaveBeenCalled()
    })

    it('他ユーザーのカテゴリにはタグを作成できない', async () => {
      vi.mocked(TagRepository.findTagCategoryById).mockResolvedValue(mockCategory as any)

      await expect(
        createTag(otherUserId, { categoryId: 'cat-1', name: 'タグ' })
      ).rejects.toThrow('このカテゴリにタグを作成する権限がありません')

      expect(TagRepository.createTag).not.toHaveBeenCalled()
    })
  })

  // ===== updateTag =====

  describe('updateTag', () => {
    it('自分のタグを更新できる', async () => {
      vi.mocked(TagRepository.findTagById).mockResolvedValue(mockTag as any)
      vi.mocked(TagRepository.updateTag).mockResolvedValue(undefined as any)

      await updateTag(userId, { tagId: 'tag-1', name: '更新タグ', description: '更新説明' })

      expect(TagRepository.updateTag).toHaveBeenCalledWith('tag-1', '更新タグ', '更新説明')
    })

    it('タグが見つからない場合はエラーを投げる', async () => {
      vi.mocked(TagRepository.findTagById).mockResolvedValue(null)

      await expect(
        updateTag(userId, { tagId: 'tag-unknown', name: '名前' })
      ).rejects.toThrow('タグが見つかりません')

      expect(TagRepository.updateTag).not.toHaveBeenCalled()
    })

    it('システムタグは編集できない', async () => {
      vi.mocked(TagRepository.findTagById).mockResolvedValue(mockSystemTag as any)

      await expect(
        updateTag(userId, { tagId: 'tag-system', name: '名前' })
      ).rejects.toThrow('システムタグは編集できません')

      expect(TagRepository.updateTag).not.toHaveBeenCalled()
    })

    it('他ユーザーのタグは編集できない', async () => {
      vi.mocked(TagRepository.findTagById).mockResolvedValue(mockTag as any)

      await expect(
        updateTag(otherUserId, { tagId: 'tag-1', name: '名前' })
      ).rejects.toThrow('このタグを編集する権限がありません')

      expect(TagRepository.updateTag).not.toHaveBeenCalled()
    })
  })

  // ===== deleteTag =====

  describe('deleteTag', () => {
    it('自分のタグを削除できる', async () => {
      vi.mocked(TagRepository.findTagById).mockResolvedValue(mockTag as any)
      vi.mocked(TagRepository.deleteTag).mockResolvedValue(undefined as any)

      await deleteTag(userId, 'tag-1')

      expect(TagRepository.deleteTag).toHaveBeenCalledWith('tag-1')
    })

    it('タグが見つからない場合はエラーを投げる', async () => {
      vi.mocked(TagRepository.findTagById).mockResolvedValue(null)

      await expect(deleteTag(userId, 'tag-unknown')).rejects.toThrow('タグが見つかりません')

      expect(TagRepository.deleteTag).not.toHaveBeenCalled()
    })

    it('システムタグは削除できない', async () => {
      vi.mocked(TagRepository.findTagById).mockResolvedValue(mockSystemTag as any)

      await expect(deleteTag(userId, 'tag-system')).rejects.toThrow(
        'システムタグは削除できません'
      )

      expect(TagRepository.deleteTag).not.toHaveBeenCalled()
    })

    it('他ユーザーのタグは削除できない', async () => {
      vi.mocked(TagRepository.findTagById).mockResolvedValue(mockTag as any)

      await expect(deleteTag(otherUserId, 'tag-1')).rejects.toThrow(
        'このタグを削除する権限がありません'
      )

      expect(TagRepository.deleteTag).not.toHaveBeenCalled()
    })
  })

  // ===== getAllTagsForRecipe =====

  describe('getAllTagsForRecipe', () => {
    it('ユーザーのタグ一覧を取得できる', async () => {
      const mockCategories = [mockCategory]
      vi.mocked(TagRepository.findTagCategoriesByUser).mockResolvedValue(mockCategories as any)

      const result = await getAllTagsForRecipe(userId)

      expect(result).toEqual(mockCategories)
      expect(TagRepository.findTagCategoriesByUser).toHaveBeenCalledWith(userId)
    })
  })

  // ===== getTagCategoriesWithTags =====

  describe('getTagCategoriesWithTags', () => {
    it('タグカテゴリとタグの一覧を返す', async () => {
      const mockCategories = [mockCategory]
      vi.mocked(TagRepository.findTagCategoriesWithRecipeTags).mockResolvedValue(
        mockCategories as any
      )

      const result = await getTagCategoriesWithTags(userId)

      expect(result).toEqual({ tagCategories: mockCategories })
      expect(TagRepository.findTagCategoriesWithRecipeTags).toHaveBeenCalledWith(userId)
    })
  })
})
