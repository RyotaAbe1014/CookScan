import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateTagIdsForUser } from '../tag-utils'

// モック: Prismaクライアント
vi.mock('@/lib/prisma', () => ({
  prisma: {
    tag: {
      findMany: vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'

describe('validateTagIdsForUser', () => {
  const mockUserId = 'user-1'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('空配列: 空配列を渡すと、validTagIds: [], isValid: true を返す', async () => {
    // Given: 空配列
    const tagIds: string[] = []

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: 空の結果が返る
    expect(result).toEqual({
      validTagIds: [],
      isValid: true,
    })
    expect(prisma.tag.findMany).not.toHaveBeenCalled()
  })

  it('重複フィルタリング: 重複するtagIdは1つにまとめられる', async () => {
    // Given: 重複するtagId
    const tagIds = ['tag-1', 'tag-2', 'tag-1', 'tag-2']
    vi.mocked(prisma.tag.findMany).mockResolvedValue([
      { id: 'tag-1' },
      { id: 'tag-2' },
    ] as any)

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: 重複が除去され、ユニークなIDでクエリが実行される
    expect(prisma.tag.findMany).toHaveBeenCalledWith({
      where: {
        id: { in: ['tag-1', 'tag-2'] },
        OR: [
          { isSystem: true },
          { user: { id: mockUserId } },
        ],
      },
      select: { id: true },
    })
    expect(result).toEqual({
      validTagIds: ['tag-1', 'tag-2'],
      isValid: true,
    })
  })

  it('重複フィルタリング: 空文字列は除外される', async () => {
    // Given: 空文字列を含む配列
    const tagIds = ['tag-1', '', 'tag-2', '']
    vi.mocked(prisma.tag.findMany).mockResolvedValue([
      { id: 'tag-1' },
      { id: 'tag-2' },
    ] as any)

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: 空文字列が除外される
    expect(prisma.tag.findMany).toHaveBeenCalledWith({
      where: {
        id: { in: ['tag-1', 'tag-2'] },
        OR: [
          { isSystem: true },
          { user: { id: mockUserId } },
        ],
      },
      select: { id: true },
    })
    expect(result).toEqual({
      validTagIds: ['tag-1', 'tag-2'],
      isValid: true,
    })
  })

  it('システムタグ検証: システムタグは誰でも使用可能', async () => {
    // Given: システムタグのID
    const tagIds = ['system-tag-1', 'system-tag-2']
    vi.mocked(prisma.tag.findMany).mockResolvedValue([
      { id: 'system-tag-1' },
      { id: 'system-tag-2' },
    ] as any)

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: すべてのタグが有効
    expect(result).toEqual({
      validTagIds: ['system-tag-1', 'system-tag-2'],
      isValid: true,
    })
  })

  it('ユーザータグ検証: ユーザー所有のタグは有効', async () => {
    // Given: ユーザー所有のタグ
    const tagIds = ['user-tag-1', 'user-tag-2']
    vi.mocked(prisma.tag.findMany).mockResolvedValue([
      { id: 'user-tag-1' },
      { id: 'user-tag-2' },
    ] as any)

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: すべてのタグが有効
    expect(result).toEqual({
      validTagIds: ['user-tag-1', 'user-tag-2'],
      isValid: true,
    })
    expect(prisma.tag.findMany).toHaveBeenCalledWith({
      where: {
        id: { in: tagIds },
        OR: [
          { isSystem: true },
          { user: { id: mockUserId } },
        ],
      },
      select: { id: true },
    })
  })

  it('無効tagId検出: 存在しないtagIdは除外される', async () => {
    // Given: 存在しないtagIdを含む
    const tagIds = ['tag-1', 'invalid-tag', 'tag-2']
    vi.mocked(prisma.tag.findMany).mockResolvedValue([
      { id: 'tag-1' },
      { id: 'tag-2' },
    ] as any)

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: 存在するタグのみが返され、isValidはfalse
    expect(result).toEqual({
      validTagIds: ['tag-1', 'tag-2'],
      isValid: false,
    })
  })

  it('無効tagId検出: 他のユーザーのタグは無効', async () => {
    // Given: 他のユーザーのタグ
    const tagIds = ['my-tag', 'other-user-tag']
    // my-tagのみが返される（other-user-tagは他のユーザーのもの）
    vi.mocked(prisma.tag.findMany).mockResolvedValue([
      { id: 'my-tag' },
    ] as any)

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: 自分のタグのみが有効、isValidはfalse
    expect(result).toEqual({
      validTagIds: ['my-tag'],
      isValid: false,
    })
  })

  it('無効tagId検出: すべてのtagIdが無効な場合、空配列とisValid: falseを返す', async () => {
    // Given: すべて無効なtagId
    const tagIds = ['invalid-1', 'invalid-2']
    vi.mocked(prisma.tag.findMany).mockResolvedValue([])

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: 空配列とisValid: false
    expect(result).toEqual({
      validTagIds: [],
      isValid: false,
    })
  })

  it('混在: システムタグとユーザータグが混在しても正しく検証される', async () => {
    // Given: システムタグとユーザータグの混在
    const tagIds = ['system-tag', 'user-tag', 'invalid-tag']
    vi.mocked(prisma.tag.findMany).mockResolvedValue([
      { id: 'system-tag' },
      { id: 'user-tag' },
    ] as any)

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: 有効なタグのみが返され、無効なタグがあるのでisValidはfalse
    expect(result).toEqual({
      validTagIds: ['system-tag', 'user-tag'],
      isValid: false,
    })
  })

  it('順序: 返されるvalidTagIdsはデータベースから返された順序', async () => {
    // Given: タグIDの配列
    const tagIds = ['tag-3', 'tag-1', 'tag-2']
    // データベースは異なる順序で返す
    vi.mocked(prisma.tag.findMany).mockResolvedValue([
      { id: 'tag-1' },
      { id: 'tag-2' },
      { id: 'tag-3' },
    ] as any)

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: データベースから返された順序でvalidTagIdsが返される
    expect(result.validTagIds).toEqual(['tag-1', 'tag-2', 'tag-3'])
  })

  it('エッジケース: nullやundefinedが含まれる場合も除外される', async () => {
    // Given: nullやundefinedを含む配列（TypeScript的には型エラーだが、実行時の安全性をテスト）
    const tagIds = ['tag-1', null as unknown as string, undefined as unknown as string, 'tag-2']
    vi.mocked(prisma.tag.findMany).mockResolvedValue([
      { id: 'tag-1' },
      { id: 'tag-2' },
    ] as any)

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: nullとundefinedが除外される
    expect(prisma.tag.findMany).toHaveBeenCalledWith({
      where: {
        id: { in: ['tag-1', 'tag-2'] },
        OR: [
          { isSystem: true },
          { user: { id: mockUserId } },
        ],
      },
      select: { id: true },
    })
    expect(result).toEqual({
      validTagIds: ['tag-1', 'tag-2'],
      isValid: true,
    })
  })

  it('エッジケース: 大量のtagIdsでも正しく動作する', async () => {
    // Given: 大量のtagIds
    const tagIds = Array.from({ length: 100 }, (_, i) => `tag-${i}`)
    const mockTags = Array.from({ length: 100 }, (_, i) => ({ id: `tag-${i}` }))
    vi.mocked(prisma.tag.findMany).mockResolvedValue(mockTags as any)

    // When: validateTagIdsForUserを呼ぶ
    const result = await validateTagIdsForUser(tagIds, mockUserId)

    // Then: すべてのタグが有効
    expect(result.validTagIds).toHaveLength(100)
    expect(result.isValid).toBe(true)
  })
})
