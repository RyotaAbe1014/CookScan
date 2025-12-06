'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { updateRecipe } from './actions'
import type { UpdateRecipeRequest } from './types'
import { getAllTagsForRecipe } from '@/features/tags/actions'
import { Header } from '@/components/header'

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
}

type Props = {
  recipe: RecipeData
}

export default function RecipeEditForm({ recipe }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
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
  const [tagCategories, setTagCategories] = useState<Array<{
    id: string
    name: string
    description: string | null
    tags: Array<{
      id: string
      name: string
      description: string | null
    }>
  }>>([])

  // タグデータの取得
  useEffect(() => {
    const fetchTags = async () => {
      const categories = await getAllTagsForRecipe()
      setTagCategories(categories)
    }
    fetchTags()
  }, [])

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

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        tags: selectedTagIds
      }

      const result = await updateRecipe(request)

      if (result.success) {
        router.push(`/recipes/${recipe.id}`)
      } else {
        alert(result.error || 'レシピの更新に失敗しました')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error updating recipe:', error)
      alert('エラーが発生しました')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="レシピを編集"
        rightAction={
          <Link
            href={`/recipes/${recipe.id}`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            詳細画面に戻る
          </Link>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="space-y-8">
            {/* 画像プレビュー */}
            {recipe.imageUrl && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">レシピ画像</h3>
                <img
                  src={recipe.imageUrl}
                  alt="レシピ画像"
                  className="mx-auto max-h-64 rounded-lg object-contain"
                />
              </div>
            )}

            {/* 基本情報 */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    レシピタイトル <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="bookName" className="block text-sm font-medium text-gray-700">
                      本の名前
                    </label>
                    <input
                      type="text"
                      id="bookName"
                      value={sourceInfo.bookName}
                      onChange={(e) => setSourceInfo({ ...sourceInfo, bookName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="pageNumber" className="block text-sm font-medium text-gray-700">
                      ページ番号
                    </label>
                    <input
                      type="text"
                      id="pageNumber"
                      value={sourceInfo.pageNumber}
                      onChange={(e) => setSourceInfo({ ...sourceInfo, pageNumber: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                      参照URL
                    </label>
                    <input
                      type="url"
                      id="url"
                      value={sourceInfo.url}
                      onChange={(e) => setSourceInfo({ ...sourceInfo, url: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
                    メモ
                  </label>
                  <textarea
                    id="memo"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                  />
                </div>
              </div>
            </div>

            {/* タグ */}
            {tagCategories.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">タグ</h3>
                <div className="space-y-4">
                  {tagCategories.map((category) => (
                    <div key={category.id}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        {category.name}
                      </h4>
                      {category.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {category.tags.map((tag) => (
                            <label
                              key={tag.id}
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                                selectedTagIds.includes(tag.id)
                                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedTagIds.includes(tag.id)}
                                onChange={() => toggleTag(tag.id)}
                                className="sr-only"
                              />
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
            )}

            {/* 材料 */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">材料</h3>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  材料を追加
                </button>
              </div>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="材料名"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="text"
                        placeholder="分量"
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="メモ"
                        value={ingredient.notes}
                        onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      disabled={ingredients.length === 1}
                      className="rounded-md p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 調理手順 */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">調理手順</h3>
                <button
                  type="button"
                  onClick={addStep}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  手順を追加
                </button>
              </div>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <textarea
                        placeholder="手順の説明"
                        value={step.instruction}
                        onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                        rows={2}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                      />
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <input
                          type="number"
                          placeholder="タイマー（秒）"
                          value={step.timerSeconds || ''}
                          onChange={(e) => updateStep(index, 'timerSeconds', e.target.value)}
                          className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                        />
                        <span className="text-sm text-gray-500">秒</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      disabled={steps.length === 1}
                      className="rounded-md p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-4">
              <Link
                href={`/recipes/${recipe.id}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !title}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    更新中...
                  </>
                ) : (
                  'レシピを更新'
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}