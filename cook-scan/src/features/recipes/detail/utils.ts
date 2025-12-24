type RecipeTag = {
  tagId: string
  tag: {
    id: string
    name: string
    category: {
      id: string
      name: string
    }
  }
}

type SourceInfo = {
  sourceName: string | null
  pageNumber: string | null
  sourceUrl: string | null
}

export function formatMemo(memo: string | null): string {
  return memo || ''
}

export function getSourceInfo(sourceInfoArray: SourceInfo[]): SourceInfo | null {
  return sourceInfoArray[0] || null
}

export function groupTagsByCategory(recipeTags: RecipeTag[]) {
  const tagsByCategory = recipeTags.reduce(
    (
      acc: Map<
        string,
        {
          name: string
          tags: Array<{ id: string; name: string }>
        }
      >,
      recipeTag: RecipeTag
    ) => {
      const categoryId = recipeTag.tag.category.id
      const categoryName = recipeTag.tag.category.name

      if (!acc.has(categoryId)) {
        acc.set(categoryId, {
          name: categoryName,
          tags: [],
        })
      }

      acc.get(categoryId)!.tags.push(recipeTag.tag)
      return acc
    },
    new Map<
      string,
      {
        name: string
        tags: Array<{ id: string; name: string }>
      }
    >()
  )

  return tagsByCategory
}
