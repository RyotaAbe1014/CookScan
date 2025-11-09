import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'
import { beforeEach } from 'vitest'

// Create a deep mock of PrismaClient
export const prismaMock = mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>

// Reset the mock before each test
beforeEach(() => {
  mockReset(prismaMock)
})

// Export the mock as the default prisma instance
export const prisma = prismaMock
