import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateUserProfile, getUserProfile } from '../actions'
import { prisma } from '@/lib/prisma'
import { checkUserProfile } from '@/features/auth/auth-utils'

// モック設定
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/features/auth/auth-utils', () => ({
  checkUserProfile: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('getUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正常系: 認証済みユーザーのプロフィールを取得できる', async () => {
    // Given: 認証済みユーザーとプロフィールが存在する
    const mockProfile = {
      id: 'user-123',
      authId: 'auth-123',
      email: 'test@example.com',
      name: 'テストユーザー',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(checkUserProfile).mockResolvedValueOnce({
      hasAuth: true,
      hasProfile: true,
      authUser: { id: 'auth-123' } as any,
      profile: mockProfile,
    })

    // When: getUserProfile()を呼び出す
    const result = await getUserProfile()

    // Then: 成功結果が返却される
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual(mockProfile)
    }
  })

  it('エラー: 未認証ユーザーの場合はエラーを返す', async () => {
    // Given: 未認証ユーザー
    vi.mocked(checkUserProfile).mockResolvedValueOnce({
      hasAuth: false,
      hasProfile: false,
      authUser: undefined,
      profile: undefined,
    } as any)

    // When: getUserProfile()を呼び出す
    const result = await getUserProfile()

    // Then: 認証エラーが返される
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('UNAUTHENTICATED')
    }
  })

  it('エラー: プロフィールが存在しない場合はエラーを返す', async () => {
    // Given: 認証済みだがプロフィールがない
    vi.mocked(checkUserProfile).mockResolvedValueOnce({
      hasAuth: true,
      hasProfile: false,
      authUser: { id: 'auth-123' } as any,
      profile: null,
    })

    // When: getUserProfile()を呼び出す
    const result = await getUserProfile()

    // Then: NOT_FOUNDエラーが返される
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('NOT_FOUND')
    }
  })
})

describe('updateUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正常系: 有効な名前でプロフィールを更新できる', async () => {
    // Given: 認証済みユーザーと有効な名前
    const mockProfile = {
      id: 'user-123',
      authId: 'auth-123',
      email: 'test@example.com',
      name: '旧名前',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(checkUserProfile).mockResolvedValueOnce({
      hasAuth: true,
      hasProfile: true,
      authUser: { id: 'auth-123' } as any,
      profile: mockProfile,
    })

    // UserService.updateProfile内のfindUserByAuthId用
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockProfile as any)

    vi.mocked(prisma.user.update).mockResolvedValueOnce({
      ...mockProfile,
      name: '新しい名前',
    } as any)

    // When: updateUserProfile()を呼び出す
    const result = await updateUserProfile({ name: '新しい名前' })

    // Then: 成功結果が返される
    expect(result.ok).toBe(true)
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { authId: 'auth-123' },
      data: { name: '新しい名前' },
    })
  })

  it('バリデーション: 空文字はエラー', async () => {
    // When: 空文字で更新しようとする
    const result = await updateUserProfile({ name: '' })

    // Then: バリデーションエラーが返される
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message).toContain('名前を入力してください')
    }
  })

  it('バリデーション: 空白のみはエラー', async () => {
    // When: 空白のみで更新しようとする
    const result = await updateUserProfile({ name: '   ' })

    // Then: バリデーションエラーが返される
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message).toContain('空白のみの名前は使用できません')
    }
  })

  it('バリデーション: 51文字以上はエラー', async () => {
    // When: 51文字以上で更新しようとする
    const longName = 'あ'.repeat(51)
    const result = await updateUserProfile({ name: longName })

    // Then: バリデーションエラーが返される
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message).toContain('50文字以内で入力してください')
    }
  })

  it('バリデーション: 50文字は許可される', async () => {
    // Given: 認証済みユーザー
    const mockProfile = {
      id: 'user-123',
      authId: 'auth-123',
      email: 'test@example.com',
      name: '旧名前',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(checkUserProfile).mockResolvedValueOnce({
      hasAuth: true,
      hasProfile: true,
      authUser: { id: 'auth-123' } as any,
      profile: mockProfile,
    })

    const name50 = 'あ'.repeat(50)

    // UserService.updateProfile内のfindUserByAuthId用
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockProfile as any)

    vi.mocked(prisma.user.update).mockResolvedValueOnce({
      ...mockProfile,
      name: name50,
    } as any)

    // When: 50文字で更新しようとする
    const result = await updateUserProfile({ name: name50 })

    // Then: 成功する
    expect(result.ok).toBe(true)
  })

  it('バリデーション: 前後の空白はtrimされる', async () => {
    // Given: 認証済みユーザー
    const mockProfile = {
      id: 'user-123',
      authId: 'auth-123',
      email: 'test@example.com',
      name: '旧名前',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(checkUserProfile).mockResolvedValueOnce({
      hasAuth: true,
      hasProfile: true,
      authUser: { id: 'auth-123' } as any,
      profile: mockProfile,
    })

    // UserService.updateProfile内のfindUserByAuthId用
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockProfile as any)

    vi.mocked(prisma.user.update).mockResolvedValueOnce({
      ...mockProfile,
      name: '山田太郎',
    } as any)

    // When: 前後に空白がある名前で更新
    const result = await updateUserProfile({ name: '  山田太郎  ' })

    // Then: trimされた名前で更新される
    expect(result.ok).toBe(true)
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { authId: 'auth-123' },
      data: { name: '山田太郎' },
    })
  })

  it('エラー: 未認証ユーザーはエラー', async () => {
    // Given: 未認証ユーザー
    vi.mocked(checkUserProfile).mockResolvedValueOnce({
      hasAuth: false,
      hasProfile: false,
      authUser: undefined,
      profile: undefined,
    } as any)

    // When: 更新しようとする
    const result = await updateUserProfile({ name: '新しい名前' })

    // Then: 認証エラーが返される
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('UNAUTHENTICATED')
    }
  })

  it('エラー: プロフィールが存在しない場合はエラー', async () => {
    // Given: 認証済みだがプロフィールがない
    vi.mocked(checkUserProfile).mockResolvedValueOnce({
      hasAuth: true,
      hasProfile: false,
      authUser: { id: 'auth-123' } as any,
      profile: null,
    })

    // When: 更新しようとする
    const result = await updateUserProfile({ name: '新しい名前' })

    // Then: NOT_FOUNDエラーが返される
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('NOT_FOUND')
    }
  })

  it('エラー: データベースエラー時は汎用エラーメッセージを返す', async () => {
    // Given: 認証済みユーザー
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockProfile = {
      id: 'user-123',
      authId: 'auth-123',
      email: 'test@example.com',
      name: '旧名前',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(checkUserProfile).mockResolvedValueOnce({
      hasAuth: true,
      hasProfile: true,
      authUser: { id: 'auth-123' } as any,
      profile: mockProfile,
    })

    // UserService.updateProfile内のfindUserByAuthId用
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockProfile as any)

    // データベースエラーをシミュレート
    vi.mocked(prisma.user.update).mockRejectedValueOnce(new Error('Database error'))

    // When: 更新しようとする
    const result = await updateUserProfile({ name: '新しい名前' })

    // Then: 汎用エラーメッセージが返される
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message).toBe('プロフィールの更新に失敗しました')
    }

    consoleErrorSpy.mockRestore()
  })
})
