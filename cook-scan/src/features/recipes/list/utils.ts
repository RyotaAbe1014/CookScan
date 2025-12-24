export type RecipeSearchParams = {
  tag?: string | string[]
  q?: string
}

export type ParsedRecipeSearchParams = {
  tagIds: string[]
  searchQuery: string
}

/**
 * searchParamsから検索クエリとタグIDを抽出
 */
export function parseRecipeSearchParams(
  searchParams: RecipeSearchParams
): ParsedRecipeSearchParams {
  const selectedTagIds = searchParams.tag
    ? Array.isArray(searchParams.tag)
      ? searchParams.tag
      : [searchParams.tag]
    : []

  const searchQuery = searchParams.q?.trim() || ''

  return {
    tagIds: selectedTagIds,
    searchQuery,
  }
}

/**
 * タグIDの配列からPrismaのwhere句を構築
 */
export function buildTagFilters(tagIds: string[]) {
  if (tagIds.length === 0) {
    return undefined
  }

  return tagIds.map((tagId) => ({
    recipeTags: {
      some: {
        tagId: tagId,
      },
    },
  }))
}
