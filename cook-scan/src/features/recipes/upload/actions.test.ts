import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRecipe } from './actions'
import { CreateRecipeRequest } from './types'
import type { User } from '@prisma/client'

// Mock dependencies
vi.mock('@/lib/prisma')
vi.mock('@/features/auth/auth-utils')

// Import mocked modules
import { prisma } from '@/lib/prisma'
import { checkUserProfile } from '@/features/auth/auth-utils'

describe('createRecipe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to login when user is not authenticated', async () => {
    // Mock unauthenticated user
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: false,
      hasProfile: false,
      profile: null,
    })

    const request: CreateRecipeRequest = {
      title: 'Test Recipe',
      sourceInfo: null,
      ingredients: [],
      steps: [],
      tags: [],
    }

    // Expect redirect to throw error (mocked in vitest.setup.ts)
    await expect(createRecipe(request)).rejects.toThrow('REDIRECT: /login')
  })

  it('should create a recipe successfully', async () => {
    const mockUserId = 'user-123'
    const mockRecipeId = 'recipe-456'

    // Mock authenticated user
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: true,
      hasProfile: true,
      profile: { id: mockUserId, name: 'Test User' } as Partial<User> as User,
    })

    // Mock Prisma transaction
    const mockTransaction = vi.fn(async <R>(callback: (tx: typeof prisma) => Promise<R>): Promise<R> => {
      const mockTx = {
        recipe: {
          create: vi.fn().mockResolvedValue({ id: mockRecipeId, userId: mockUserId }),
        },
        ingredient: {
          createMany: vi.fn(),
        },
        step: {
          createMany: vi.fn(),
        },
        sourceInfo: {
          create: vi.fn(),
        },
      }
      return callback(mockTx as unknown as typeof prisma)
    })

    vi.mocked(prisma.$transaction).mockImplementation(mockTransaction)

    const request: CreateRecipeRequest = {
      title: 'Test Recipe',
      sourceInfo: {
        bookName: 'Test Book',
        pageNumber: '123',
      },
      ingredients: [
        { name: 'Ingredient 1', unit: 'cup' },
        { name: 'Ingredient 2' },
      ],
      steps: [
        { instruction: 'Step 1' },
        { instruction: 'Step 2', timerSeconds: 300 },
      ],
      memo: 'Test memo',
      tags: ['tag1', 'tag2'],
    }

    const result = await createRecipe(request)

    expect(result).toEqual({
      success: true,
      recipeId: mockRecipeId,
    })
    expect(checkUserProfile).toHaveBeenCalledOnce()
    expect(prisma.$transaction).toHaveBeenCalledOnce()
  })

  it('should handle errors gracefully', async () => {
    // Mock authenticated user
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: true,
      hasProfile: true,
      profile: { id: 'user-123' } as Partial<User> as User,
    })

    // Mock Prisma transaction to throw error
    vi.mocked(prisma.$transaction).mockRejectedValue(new Error('Database error'))

    const request: CreateRecipeRequest = {
      title: 'Test Recipe',
      sourceInfo: null,
      ingredients: [],
      steps: [],
      tags: [],
    }

    const result = await createRecipe(request)

    expect(result).toEqual({
      success: false,
      error: 'レシピの作成に失敗しました',
    })
  })
})
