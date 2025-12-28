import type { RecipeTag } from '@/types/recipe'
import type { SourceInfo, SourceInfoDisplay } from '@/types/sourceInfo'

export function formatMemo(memo: string | null | undefined): string {
  return memo || ''
}

export function getSourceInfo(sourceInfoArray: SourceInfo[]): SourceInfoDisplay | null {
  if (!sourceInfoArray || sourceInfoArray.length === 0) {
    return null
  }
  const first = sourceInfoArray[0]
  return {
    sourceName: first.sourceName ?? null,
    pageNumber: first.pageNumber ?? null,
    sourceUrl: first.sourceUrl ?? null,
  }
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
