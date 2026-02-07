'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { updateRecipe } from './actions'
import { isSuccess } from '@/utils/result'
import type { UpdateRecipeRequest } from './types'
import type { RecipeFormTagCategory } from '@/features/recipes/types/tag'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { IngredientInput, StepInput, FormActions, ChildRecipeInput, ChildRecipeSelectorDialog } from '@/features/recipes/components'
import type { ChildRecipeItem } from '@/features/recipes/components'
import { CameraIcon } from '@/components/icons/camera-icon'
import { InfoCircleIcon } from '@/components/icons/info-circle-icon'
import { TagIcon } from '@/components/icons/tag-icon'
import { BookOpenIcon } from '@/components/icons/book-open-icon'
import { DocumentIcon } from '@/components/icons/document-icon'
import { LinkIcon } from '@/components/icons/link-icon'
import { DocumentTextIcon } from '@/components/icons/document-text-icon'
import { CheckSolidIcon } from '@/components/icons/check-solid-icon'
import { BeakerIcon } from '@/components/icons/beaker-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { ClipboardListIcon } from '@/components/icons/clipboard-list-icon'
import { FolderIcon } from '@/components/icons/folder-icon'

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
  usedInRecipes: {
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
  const [title, setTitle] = useState(recipe.title)
  const [sourceInfo, setSourceInfo] = useState({
    bookName: recipe.sourceInfo[0]?.sourceName || '',
    pageNumber: recipe.sourceInfo[0]?.pageNumber || '',
    url: recipe.sourceInfo[0]?.sourceUrl || ''
  })
  const [ingredients, setIngredients] = useState<Array<{
    id?: string
    name: string
    unit: string
    notes: string
  }>>(
    recipe.ingredients.map(ing => ({
      id: ing.id,
      name: ing.name,
      unit: ing.unit || '',
      notes: ing.notes || ''
    }))
  )
  const [steps, setSteps] = useState<Array<{
    id?: string
    instruction: string
    timerSeconds?: number
    orderIndex: number
  }>>(
    recipe.steps.map(step => ({
      id: step.id,
      instruction: step.instruction,
      timerSeconds: step.timerSeconds || undefined,
      orderIndex: step.orderIndex
    }))
  )
  const [memo, setMemo] = useState(recipe.memo || '')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    recipe.recipeTags.map(rt => rt.tagId)
  )
  const [childRecipes, setChildRecipes] = useState<ChildRecipeItem[]>(
    recipe.usedInRecipes.map(rel => ({
      childRecipeId: rel.childRecipeId,
      childRecipeTitle: rel.childRecipe.title,
      quantity: rel.quantity || '',
      notes: rel.notes || '',
    }))
  )
  const [isChildRecipeDialogOpen, setIsChildRecipeDialogOpen] = useState(false)

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: '', unit: '', notes: '' }
    ])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const updateIngredient = (index: number, field: 'name' | 'unit' | 'notes', value: string) => {
    setIngredients(ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    ))
  }

  const addStep = () => {
    setSteps([
      ...steps,
      { instruction: '', timerSeconds: undefined, orderIndex: steps.length + 1 }
    ])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index)
      // 順序を再調整
      setSteps(newSteps.map((step, i) => ({ ...step, orderIndex: i + 1 })))
    }
  }

  const updateStep = (index: number, field: 'instruction' | 'timerSeconds', value: string) => {
    setSteps(steps.map((step, i) =>
      i === index
        ? {
          ...step,
          [field]: field === 'timerSeconds'
            ? (value ? parseInt(value) : undefined)
            : value
        }
        : step
    ))
  }

  const addChildRecipe = (item: ChildRecipeItem) => {
    setChildRecipes([...childRecipes, item])
  }

  const removeChildRecipe = (index: number) => {
    setChildRecipes(childRecipes.filter((_, i) => i !== index))
  }

  const updateChildRecipe = (index: number, field: 'quantity' | 'notes', value: string) => {
    setChildRecipes(childRecipes.map((cr, i) =>
      i === index ? { ...cr, [field]: value } : cr
    ))
  }

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

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
        steps: steps.map(step => ({
          id: step.id,
          instruction: step.instruction,
          timerSeconds: step.timerSeconds,
          orderIndex: step.orderIndex
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
          <div className="overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
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
          </div>
        )}

        {/* 基本情報 */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
          <div className="border-b border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 shadow-md">
                <InfoCircleIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">基本情報</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <TagIcon className="h-4 w-4 text-emerald-600" />
                  レシピタイトル <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="美味しい料理の名前を入力"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="bookName" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <BookOpenIcon className="h-4 w-4 text-amber-600" />
                    本の名前
                  </label>
                  <Input
                    type="text"
                    id="bookName"
                    value={sourceInfo.bookName}
                    onChange={(e) => setSourceInfo({ ...sourceInfo, bookName: e.target.value })}
                    placeholder="料理本の名前"
                  />
                </div>
                <div>
                  <label htmlFor="pageNumber" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <DocumentIcon className="h-4 w-4 text-green-600" />
                    ページ番号
                  </label>
                  <Input
                    type="text"
                    id="pageNumber"
                    value={sourceInfo.pageNumber}
                    onChange={(e) => setSourceInfo({ ...sourceInfo, pageNumber: e.target.value })}
                    placeholder="P.123"
                  />
                </div>
                <div>
                  <label htmlFor="url" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <LinkIcon className="h-4 w-4 text-blue-600" />
                    参照URL
                  </label>
                  <Input
                    type="url"
                    id="url"
                    value={sourceInfo.url}
                    onChange={(e) => setSourceInfo({ ...sourceInfo, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label htmlFor="memo" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <DocumentTextIcon className="h-4 w-4 text-teal-600" />
                  メモ
                </label>
                <Textarea
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                  placeholder="このレシピについてのメモや感想..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* タグ */}
        {tagCategories.length > 0 && (
          <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
            <div className="border-b border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-600 shadow-md">
                  <TagIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">タグ</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tagCategories.map((category) => (
                  <div key={category.id}>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-amber-600" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        {category.name}
                      </h4>
                    </div>
                    {category.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {category.tags.map((tag) => (
                          <label
                            key={tag.id}
                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${selectedTagIds.includes(tag.id)
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-indigo-600'
                              : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-200 hover:ring-gray-300'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedTagIds.includes(tag.id)}
                              onChange={() => toggleTag(tag.id)}
                              className="sr-only"
                            />
                            {selectedTagIds.includes(tag.id) && (
                              <CheckSolidIcon className="h-3.5 w-3.5" />
                            )}
                            <span>{tag.name}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">このカテゴリにはタグがありません</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 材料 */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
          <div className="flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-600 shadow-md">
                <BeakerIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">材料</h3>
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-green-600 to-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-green-500/30 transition-all hover:shadow-lg hover:shadow-green-500/40"
            >
              <PlusIcon className="h-4 w-4" stroke="currentColor" />
              材料を追加
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <IngredientInput
                  key={index}
                  ingredient={ingredient}
                  index={index}
                  canDelete={ingredients.length > 1}
                  onUpdate={updateIngredient}
                  onRemove={removeIngredient}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 調理手順 */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
          <div className="flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 shadow-md">
                <ClipboardListIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">調理手順</h3>
            </div>
            <button
              type="button"
              onClick={addStep}
              className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/40"
            >
              <PlusIcon className="h-4 w-4" stroke="currentColor" />
              手順を追加
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <StepInput
                  key={index}
                  step={step}
                  index={index}
                  canDelete={steps.length > 1}
                  onUpdate={updateStep}
                  onRemove={removeStep}
                />
              ))}
            </div>
          </div>
        </div>

        {/* サブレシピ */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
          <div className="flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-violet-600 shadow-md">
                <FolderIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">サブレシピ</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsChildRecipeDialogOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-purple-600 to-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/40"
            >
              <PlusIcon className="h-4 w-4" stroke="currentColor" />
              サブレシピを追加
            </button>
          </div>
          <div className="p-6">
            {childRecipes.length > 0 ? (
              <div className="space-y-3">
                {childRecipes.map((item, index) => (
                  <ChildRecipeInput
                    key={item.childRecipeId}
                    item={item}
                    index={index}
                    onUpdate={updateChildRecipe}
                    onRemove={removeChildRecipe}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">サブレシピが追加されていません</p>
            )}
          </div>
        </div>

        <ChildRecipeSelectorDialog
          isOpen={isChildRecipeDialogOpen}
          onClose={() => setIsChildRecipeDialogOpen(false)}
          onAdd={addChildRecipe}
          parentRecipeId={recipe.id}
          existingChildRecipeIds={childRecipes.map(cr => cr.childRecipeId)}
        />

        {/* ボタン */}
        <div className="rounded-xl bg-linear-to-r from-gray-50 to-white p-6 shadow-lg ring-1 ring-gray-900/5">
          <FormActions
            isSubmitting={isSubmitting}
            disabled={!title}
            submitLabel="レシピを更新"
            onCancel={() => router.push(`/recipes/${recipe.id}`)}
          />
        </div>
      </div>
    </form>
  )
}