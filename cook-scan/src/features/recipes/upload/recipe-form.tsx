'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import type { ExtractedRecipeData } from './types'
import type { RecipeFormTagCategory } from '@/features/recipes/types/tag'
import { createRecipe } from './actions'
import { isSuccess } from '@/utils/result'
import { useRecipeForm } from '@/features/recipes/hooks/use-recipe-form'
import { Card, CardContent } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { BasicInfoSection, TagSection, IngredientSection, StepSection, ChildRecipeSection, FormActions } from '@/features/recipes/components'
import { CameraIcon } from '@/components/icons/camera-icon'

type Props = {
  imageUrl: string | null
  extractedData: ExtractedRecipeData | null
  tagCategories: RecipeFormTagCategory[]
}

export default function RecipeForm({ imageUrl, extractedData, tagCategories }: Props) {
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
      title: extractedData?.title || '',
      sourceInfo: {
        bookName: extractedData?.sourceInfo?.bookName || '',
        pageNumber: extractedData?.sourceInfo?.pageNumber || '',
        url: extractedData?.sourceInfo?.url || '',
      },
      ingredients: extractedData?.ingredients || [],
      steps: extractedData?.steps || [],
      memo: extractedData?.memo || '',
      selectedTagIds: [],
      childRecipes: [],
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await createRecipe({
        title,
        sourceInfo: sourceInfo.bookName || sourceInfo.pageNumber || sourceInfo.url ? sourceInfo : null,
        ingredients,
        steps,
        memo,
        tags: selectedTagIds,
        childRecipes: childRecipes.map(cr => ({
          childRecipeId: cr.childRecipeId,
          quantity: cr.quantity || undefined,
          notes: cr.notes || undefined,
        })),
      })

      if (isSuccess(result)) {
        router.push(`/recipes/${result.data.recipeId}`)
      } else {
        setError(result.error.message)
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Error creating recipe:', err)
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
        {imageUrl && (
          <Card>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 shadow-md">
                  <CameraIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">アップロードした画像</h3>
              </div>
              <Image
                src={imageUrl}
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
              submitLabel="レシピを保存"
              onCancel={() => router.push('/recipes')}
            />
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
