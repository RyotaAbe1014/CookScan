'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import type { ExtractedRecipeData } from './types'
import type { RecipeFormTagCategory } from '@/features/recipes/types/tag'
import { createRecipe } from './actions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { IngredientInput, StepInput, FormActions } from '@/features/recipes/components'
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

type Props = {
  imageUrl: string | null
  extractedData: ExtractedRecipeData | null
  tagCategories: RecipeFormTagCategory[]
}

export default function RecipeForm({ imageUrl, extractedData, tagCategories }: Props) {
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

        {/* 基本情報 */}
        <Card>
          <CardHeader
            icon={
              <InfoCircleIcon className="h-5 w-5 text-white" />
            }
            iconColor="emerald"
            title="基本情報"
          />
          <CardContent>
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
          </CardContent>
        </Card>

        {/* タグ */}
        {tagCategories.length > 0 && (
          <Card>
            <CardHeader
              icon={
                <TagIcon className="h-5 w-5 text-white" />
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
            </CardContent>
          </Card>
        )}

        {/* 材料 */}
        <Card>
          <CardHeader
            icon={
              <BeakerIcon className="h-5 w-5 text-white" />
            }
            iconColor="green"
            title="材料"
            actions={
              <button
                type="button"
                onClick={addIngredient}
                className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-green-600 to-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-green-500/30 transition-all hover:shadow-lg hover:shadow-green-500/40"
              >
                <PlusIcon className="h-4 w-4" stroke="currentColor" />
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
              <ClipboardListIcon className="h-5 w-5 text-white" />
            }
            iconColor="blue"
            title="調理手順"
            actions={
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/40"
              >
                <PlusIcon className="h-4 w-4" stroke="currentColor" />
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
