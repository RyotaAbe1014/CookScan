import { RecipeImageSection } from './recipe-image-section'
import { RecipeSourceInfo } from './recipe-source-info'
import { RecipeMemo } from './recipe-memo'
import { RecipeTagsSection } from './recipe-tags-section'
import { RecipeIngredients } from './recipe-ingredients'
import { RecipeSteps } from './recipe-steps'
import { RecipeDetailActions } from './recipe-detail-actions'
import { formatMemo, getSourceInfo } from './utils'

type Recipe = {
  id: string
  title: string
  imageUrl: string | null
  memo: string | null
  sourceInfo: Array<{
    sourceName: string | null
    pageNumber: string | null
    sourceUrl: string | null
  }>
  ingredients: Array<{
    id: string
    name: string
    unit: string | null
    notes: string | null
  }>
  steps: Array<{
    id: string
    orderIndex: number
    instruction: string
    timerSeconds: number | null
  }>
  recipeTags: Array<{
    tagId: string
    tag: {
      id: string
      name: string
      category: {
        id: string
        name: string
      }
    }
  }>
}

type RecipeDetailContentProps = {
  recipe: Recipe
}

export function RecipeDetailContent({ recipe }: RecipeDetailContentProps) {
  const memo = formatMemo(recipe.memo)
  const sourceInfo = getSourceInfo(recipe.sourceInfo)

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* 左側: レシピ画像とソース情報 */}
      <div className="lg:col-span-1">
        {recipe.imageUrl && <RecipeImageSection imageUrl={recipe.imageUrl} title={recipe.title} />}
        {sourceInfo && <RecipeSourceInfo sourceInfo={sourceInfo} />}
        {memo && <RecipeMemo memo={memo} />}
        <RecipeTagsSection recipeTags={recipe.recipeTags} />
      </div>

      {/* 右側: 材料と調理手順 */}
      <div className="lg:col-span-2">
        <RecipeIngredients ingredients={recipe.ingredients} />
        <RecipeSteps steps={recipe.steps} />
      </div>

      {/* アクションボタン */}
      <div className="col-span-full mt-8 flex justify-center">
        <RecipeDetailActions recipe={recipe} />
      </div>
    </div>
  )
}
