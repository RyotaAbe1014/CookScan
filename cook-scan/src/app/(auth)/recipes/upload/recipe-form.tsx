'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import type { ExtractedRecipeData } from './types'

type Props = {
  imageUrl: string | null
  extractedData: ExtractedRecipeData | null
}

export default function RecipeForm({ imageUrl, extractedData }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(extractedData?.title || '')
  const [sourceInfo, setSourceInfo] = useState({
    bookName: extractedData?.sourceInfo?.bookName || '',
    pageNumber: extractedData?.sourceInfo?.pageNumber || '',
    url: extractedData?.sourceInfo?.url || ''
  })
  const [ingredients, setIngredients] = useState<ExtractedRecipeData['ingredients']>(
    extractedData?.ingredients || []
  )
  const [steps, setSteps] = useState<ExtractedRecipeData['steps']>(
    extractedData?.steps || []
  )
  const [memo, setMemo] = useState(extractedData?.memo || '')

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

  const updateIngredient = (index: number, field: keyof ExtractedRecipeData['ingredients'][number], value: string) => {
    setIngredients(ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    ))
  }

  const addStep = () => {
    setSteps([
      ...steps,
      { instruction: '', timerSeconds: undefined }
    ])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const updateStep = (index: number, field: keyof ExtractedRecipeData['steps'][number], value: string) => {
    setSteps(steps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: 実際の保存処理を実装
    setTimeout(() => {
      setIsSubmitting(false)
      alert('レシピを保存しました（仮）')
      router.push('/recipes')
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
      <div className="space-y-8">
        {/* 画像プレビュー */}
        {imageUrl && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">アップロードした画像</h3>
            <img
              src={imageUrl}
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              />
            </div>
          </div>
        </div>

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
                      value={step.timerSeconds}
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
          <button
            type="button"
            onClick={() => router.push('/recipes')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            キャンセル
          </button>
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
                保存中...
              </>
            ) : (
              'レシピを保存'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}