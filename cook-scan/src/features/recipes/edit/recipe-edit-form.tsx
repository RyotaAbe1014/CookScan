'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { updateRecipe } from './actions'
import { isSuccess } from '@/utils/result'
import type { UpdateRecipeRequest } from './types'
import type { RecipeFormTagCategory } from '@/features/recipes/types/tag'
import { useRecipeForm } from '@/features/recipes/hooks/use-recipe-form'
import { Card, CardContent } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { BasicInfoSection, TagSection, IngredientSection, StepSection, ChildRecipeSection, FormActions } from '@/features/recipes/components'
import { CameraIcon } from '@/components/icons/camera-icon'

type RecipeData = {
  id: string
  title: string
  memo: string | null
  imageUrl: string | null
  ingredients: {
    id: string
    name: string
    unit: string | null
    notes: string | null
  }[]
  steps: {
    id: string
    orderIndex: number
    instruction: string
    timerSeconds: number | null
  }[]
  sourceInfo: {
    id: string
    sourceName: string | null
    pageNumber: string | null
    sourceUrl: string | null
  }[]
  recipeTags: {
    tagId: string
    tag: {
      id: string
      name: string
    }
  }[]
  childRecipes: {
    id: string
    childRecipeId: string
    quantity: string | null
    notes: string | null
    childRecipe: { id: string; title: string; imageUrl: string | null }
  }[]
}

type Props = {
  recipe: RecipeData
  tagCategories: RecipeFormTagCategory[]
}

export default function RecipeEditForm({ recipe, tagCategories }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isChildRecipeDialogOpen, setIsChildRecipeDialogOpen] = useState(false)

  // カスタムフックで状態管理とロジックを統一
  const {
    title,
    setTitle,
    sourceInfo,
    setSourceInfo,
    ingredients,
    steps,
    memo,
    setMemo,
    selectedTagIds,
    childRecipes,
    addIngredient,
    removeIngredient,
    updateIngredient,
    addStep,
    removeStep,
    updateStep,
    addChildRecipe,
    removeChildRecipe,
    updateChildRecipe,
    toggleTag,
  } = useRecipeForm({
    initialData: {
      title: recipe.title,
      sourceInfo: {
        bookName: recipe.sourceInfo[0]?.sourceName || '',
        pageNumber: recipe.sourceInfo[0]?.pageNumber || '',
        url: recipe.sourceInfo[0]?.sourceUrl || '',
      },
      ingredients: recipe.ingredients.map(ing => ({
        id: ing.id,
        name: ing.name,
        unit: ing.unit || '',
        notes: ing.notes || '',
      })),
      steps: recipe.steps.map(step => ({
        id: step.id,
        instruction: step.instruction,
        timerSeconds: step.timerSeconds || undefined,
        orderIndex: step.orderIndex,
      })),
      memo: recipe.memo || '',
      selectedTagIds: recipe.recipeTags.map(rt => rt.tagId),
      childRecipes: recipe.childRecipes.map(rel => ({
        childRecipeId: rel.childRecipeId,
        childRecipeTitle: rel.childRecipe.title,
        quantity: rel.quantity || '',
        notes: rel.notes || '',
      })),
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const request: UpdateRecipeRequest = {
        recipeId: recipe.id,
        title,
        sourceInfo: sourceInfo.bookName || sourceInfo.pageNumber || sourceInfo.url
          ? sourceInfo
          : null,
        ingredients: ingredients.map(ing => ({
          id: ing.id,
          name: ing.name,
          unit: ing.unit || undefined,
          notes: ing.notes || undefined
        })),
        steps: steps.map((step, index) => ({
          id: step.id,
          instruction: step.instruction,
          timerSeconds: step.timerSeconds,
          orderIndex: step.orderIndex ?? index + 1
        })),
        memo,
        tags: selectedTagIds,
        childRecipes: childRecipes.map(cr => ({
          childRecipeId: cr.childRecipeId,
          quantity: cr.quantity || undefined,
          notes: cr.notes || undefined,
        })),
      }

      const result = await updateRecipe(request)

      if (isSuccess(result)) {
        router.push(`/recipes/${recipe.id}`)
      } else {
        setError(result.error.message)
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Error updating recipe:', err)
      setError('エラーが発生しました')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
      <div className="space-y-6">
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}
        {/* 画像プレビュー */}
        {recipe.imageUrl && (
          <Card>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 shadow-md">
                  <CameraIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">レシピ画像</h3>
              </div>
              <Image
                src={recipe.imageUrl}
                alt="レシピ画像"
                width={800}
                height={256}
                className="mx-auto max-h-64 rounded-xl object-contain shadow-md"
              />
            </CardContent>
          </Card>
        )}

        <BasicInfoSection
          title={title}
          onTitleChange={setTitle}
          sourceInfo={sourceInfo}
          onSourceInfoChange={setSourceInfo}
          memo={memo}
          onMemoChange={setMemo}
        />

        <TagSection
          tagCategories={tagCategories}
          selectedTagIds={selectedTagIds}
          onToggleTag={toggleTag}
        />

        <IngredientSection
          ingredients={ingredients}
          onAdd={addIngredient}
          onUpdate={updateIngredient}
          onRemove={removeIngredient}
        />

        <ChildRecipeSection
          childRecipes={childRecipes}
          isDialogOpen={isChildRecipeDialogOpen}
          onOpenDialog={() => setIsChildRecipeDialogOpen(true)}
          onCloseDialog={() => setIsChildRecipeDialogOpen(false)}
          onAdd={addChildRecipe}
          onUpdate={updateChildRecipe}
          onRemove={removeChildRecipe}
          parentRecipeId={recipe.id}
        />

        <StepSection
          steps={steps}
          onAdd={addStep}
          onUpdate={updateStep}
          onRemove={removeStep}
        />

        {/* ボタン */}
        <Card>
          <CardContent>
            <FormActions
              isSubmitting={isSubmitting}
              disabled={!title}
              submitLabel="レシピを更新"
              onCancel={() => router.push(`/recipes/${recipe.id}`)}
            />
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
