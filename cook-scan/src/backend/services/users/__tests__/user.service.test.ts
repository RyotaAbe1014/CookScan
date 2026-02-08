import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/backend/repositories/user.repository', () => ({
  findUserByAuthId: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
}))

import * as UserRepository from '@/backend/repositories/user.repository'
import {
  checkExistingProfile,
  createProfile,
  updateProfile,
  getUserProfile,
} from '../user.service'

describe('user.service', () => {
  const mockUser = {
    id: 'user-1',
    authId: 'auth-1',
    email: 'test@example.com',
    name: 'テストユーザー',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ===== checkExistingProfile =====

  describe('checkExistingProfile', () => {
    it('プロフィールが存在する場合、exists: true を返す', async () => {
      vi.mocked(UserRepository.findUserByAuthId).mockResolvedValue(mockUser)

      const result = await checkExistingProfile('auth-1')

      expect(result).toEqual({ exists: true, profile: mockUser })
      expect(UserRepository.findUserByAuthId).toHaveBeenCalledWith('auth-1')
    })

    it('プロフィールが存在しない場合、exists: false を返す', async () => {
      vi.mocked(UserRepository.findUserByAuthId).mockResolvedValue(null)

      const result = await checkExistingProfile('auth-unknown')

      expect(result).toEqual({ exists: false, profile: null })
    })
  })

  // ===== createProfile =====

  describe('createProfile', () => {
    it('新規プロフィールを作成できる', async () => {
      vi.mocked(UserRepository.findUserByAuthId).mockResolvedValue(null)
      vi.mocked(UserRepository.createUser).mockResolvedValue(mockUser)

      const result = await createProfile({
        authId: 'auth-1',
        email: 'test@example.com',
        name: 'テストユーザー',
      })

      expect(result).toEqual(mockUser)
      expect(UserRepository.createUser).toHaveBeenCalledWith(
        'auth-1',
        'test@example.com',
        'テストユーザー'
      )
    })

    it('既にプロフィールが存在する場合はエラーを投げる', async () => {
      vi.mocked(UserRepository.findUserByAuthId).mockResolvedValue(mockUser)

      await expect(
        createProfile({
          authId: 'auth-1',
          email: 'test@example.com',
          name: 'テストユーザー',
        })
      ).rejects.toThrow('プロフィールは既に作成されています')

      expect(UserRepository.createUser).not.toHaveBeenCalled()
    })
  })

  // ===== updateProfile =====

  describe('updateProfile', () => {
    it('プロフィールを更新できる', async () => {
      const updatedUser = { ...mockUser, name: '更新後の名前' }
      vi.mocked(UserRepository.findUserByAuthId).mockResolvedValue(mockUser)
      vi.mocked(UserRepository.updateUser).mockResolvedValue(updatedUser)

      const result = await updateProfile('auth-1', { name: '更新後の名前' })

      expect(result).toEqual(updatedUser)
      expect(UserRepository.updateUser).toHaveBeenCalledWith('auth-1', '更新後の名前')
    })

    it('プロフィールが存在しない場合はエラーを投げる', async () => {
      vi.mocked(UserRepository.findUserByAuthId).mockResolvedValue(null)

      await expect(updateProfile('auth-unknown', { name: '名前' })).rejects.toThrow(
        'プロフィールが見つかりません'
      )

      expect(UserRepository.updateUser).not.toHaveBeenCalled()
    })
  })

  // ===== getUserProfile =====

  describe('getUserProfile', () => {
    it('プロフィールを取得できる', async () => {
      vi.mocked(UserRepository.findUserByAuthId).mockResolvedValue(mockUser)

      const result = await getUserProfile('auth-1')

      expect(result).toEqual(mockUser)
      expect(UserRepository.findUserByAuthId).toHaveBeenCalledWith('auth-1')
    })

    it('存在しない場合は null を返す', async () => {
      vi.mocked(UserRepository.findUserByAuthId).mockResolvedValue(null)

      const result = await getUserProfile('auth-unknown')

      expect(result).toBeNull()
    })
  })
})
