'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import type { ExtractedRecipeData } from './types'
import { createRecipe } from './actions'
import { getAllTagsForRecipe } from '@/features/tags/actions'
import { Input, Textarea, Card, CardHeader, CardContent, Alert } from '@/components/ui'
import { IngredientInput, StepInput, FormActions } from '@/features/recipes/components'

type Props = {
  imageUrl: string | null
  extractedData: ExtractedRecipeData | null
}

export default function RecipeForm({ imageUrl, extractedData }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
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
    setSteps(steps.map((step, i) => {
      if (i === index) {
        if (field === 'timerSeconds') {
          const numValue = value === '' ? undefined : Number(value)
          return { ...step, [field]: isNaN(numValue as number) ? undefined : numValue }
        }
        return { ...step, [field]: value }
      }
      return step
    }))
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
      const result = await createRecipe({
        title,
        sourceInfo: sourceInfo.bookName || sourceInfo.pageNumber || sourceInfo.url
          ? sourceInfo
          : null,
        ingredients,
        steps,
        memo,
        tags: selectedTagIds
      })

      if (result.success) {
        router.push(`/recipes/${result.recipeId}`)
      } else {
        setError(result.error || 'レシピの保存に失敗しました')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error creating recipe:', error)
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
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
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

        {/* 基本情報 */}
        <Card>
          <CardHeader
            icon={
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconColor="indigo"
            title="基本情報"
          />
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
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
                    <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
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
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
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
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
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
                  <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
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
          </CardContent>
        </Card>

        {/* タグ */}
        {tagCategories.length > 0 && (
          <Card>
            <CardHeader
              icon={
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              }
              iconColor="amber"
              title="タグ"
            />
            <CardContent>
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
                            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                              selectedTagIds.includes(tag.id)
                                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-600'
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
                              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
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
            </CardContent>
          </Card>
        )}

        {/* 材料 */}
        <Card>
          <CardHeader
            icon={
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            iconColor="green"
            title="材料"
            actions={
              <button
                type="button"
                onClick={addIngredient}
                className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-green-600 to-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-green-500/30 transition-all hover:shadow-lg hover:shadow-green-500/40"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                材料を追加
              </button>
            }
          />
          <CardContent>
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
          </CardContent>
        </Card>

        {/* 調理手順 */}
        <Card>
          <CardHeader
            icon={
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            iconColor="blue"
            title="調理手順"
            actions={
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/40"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                手順を追加
              </button>
            }
          />
          <CardContent>
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
          </CardContent>
        </Card>

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
