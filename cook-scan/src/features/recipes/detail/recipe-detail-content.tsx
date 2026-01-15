'use client'

import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import type { RecipeWithRelations } from '@/types/recipe'
import { RecipeImageSection } from './recipe-image-section'
import { RecipeSourceInfo } from './recipe-source-info'
import { RecipeMemo } from './recipe-memo'
import { RecipeTagsSection } from './recipe-tags-section'
import { RecipeIngredients } from './recipe-ingredients'
import { RecipeSteps } from './recipe-steps'
import { RecipeDetailActions } from './recipe-detail-actions'
import { CookingTimerManager } from './cooking-timer-manager'
import { formatMemo, getSourceInfo } from './utils'
import { cleanupOldTimerStatesAtom } from './atoms/timer-atoms'
import { InfoCircleIcon } from '@/components/icons/info-circle-icon'

type RecipeDetailContentProps = {
  recipe: RecipeWithRelations
}

export function RecipeDetailContent({ recipe }: RecipeDetailContentProps) {
  const memo = formatMemo(recipe.memo)
  const sourceInfo = getSourceInfo(recipe.sourceInfo)
  const cleanupOldTimerStates = useSetAtom(cleanupOldTimerStatesAtom)

  // ページマウント時に古いタイマー状態をクリーンアップ
  useEffect(() => {
    cleanupOldTimerStates()
  }, [cleanupOldTimerStates])


  return (
    <div className="space-y-8">
      {/* アクティブタイマー一覧（ページ上部） */}
      <CookingTimerManager recipeId={recipe.id} />

      {/* キャプチャ対象: 料理名と登録日、レシピ画像とソース情報、材料と調理手順 */}
      <div id="recipe-detail-capture" className="space-y-8">
        {/* 料理名と登録日 */}
        <div className="mb-8">
          <h1 className="bg-emerald-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            {recipe.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
            <InfoCircleIcon className="h-4 w-4 text-emerald-500" />
            作成日: {recipe.createdAt.toLocaleDateString('ja-JP')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
            <RecipeSteps recipeId={recipe.id} recipeTitle={recipe.title} steps={recipe.steps} />
          </div>
        </div>
      </div>

      {/* アクションボタン（キャプチャ対象外） */}
      <div className="flex justify-center">
        <RecipeDetailActions recipe={recipe} />
      </div>
    </div>
  )
}
