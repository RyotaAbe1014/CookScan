import { prisma } from '@/lib/prisma'

type TagValidationResult = {
  validTagIds: string[]
  isValid: boolean
}

export async function validateTagIdsForUser(
  tagIds: string[],
  userId: string
): Promise<TagValidationResult> {
  const uniqueTagIds = Array.from(new Set(tagIds)).filter(Boolean)

  if (uniqueTagIds.length === 0) {
    return { validTagIds: [], isValid: true }
  }

  const validTags = await prisma.tag.findMany({
    where: {
      id: { in: uniqueTagIds },
      OR: [
        { isSystem: true },
        { category: { userId } },
      ],
    },
    select: { id: true },
  })

  const validTagIds = validTags.map((tag) => tag.id)

  return {
    validTagIds,
    isValid: validTagIds.length === uniqueTagIds.length,
  }
}
