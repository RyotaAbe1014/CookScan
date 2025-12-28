'use client'

import { useEffect } from 'react'
import { RecipeImageSection } from './recipe-image-section'
import { RecipeSourceInfo } from './recipe-source-info'
import { RecipeMemo } from './recipe-memo'
import { RecipeTagsSection } from './recipe-tags-section'
import { RecipeIngredients } from './recipe-ingredients'
import { RecipeSteps } from './recipe-steps'
import { RecipeDetailActions } from './recipe-detail-actions'
import { CookingTimerManager } from './cooking-timer-manager'
import { formatMemo, getSourceInfo } from './utils'
import { cleanupOldTimerStates } from '@/utils/timer-persistence'

type Recipe = {
  id: string
  title: string
  imageUrl: string | null
  memo: string | null
  createdAt: Date
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
  console.log('recipeDetailContent recipe', recipe)

  // ページマウント時に古いタイマー状態をクリーンアップ
  useEffect(() => {
    cleanupOldTimerStates()
  }, [])


  return (
    <div className="space-y-8">
      {/* アクティブタイマー一覧（ページ上部） */}
      <CookingTimerManager recipeId={recipe.id} />

      {/* キャプチャ対象: 料理名と登録日、レシピ画像とソース情報、材料と調理手順 */}
      <div id="recipe-detail-capture" className="space-y-8">
        {/* 料理名と登録日 */}
        <div className="mb-8">
          <h1 className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            {recipe.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
            <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
            <RecipeSteps recipeId={recipe.id} steps={recipe.steps} />
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
