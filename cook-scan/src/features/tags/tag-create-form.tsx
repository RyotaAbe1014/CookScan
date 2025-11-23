'use client'

import { useState, useActionState } from 'react'
import { createTagCategory, createTag } from './actions'

type TagCategory = {
  id: string
  name: string
  description: string | null
  isSystem: boolean
}

type TagCreateFormProps = {
  categories: TagCategory[]
}

export function TagCreateForm({ categories }: TagCreateFormProps) {
  const [activeTab, setActiveTab] = useState<'tag' | 'category'>('tag')

  // タグ作成フォーム
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories.find(c => !c.isSystem)?.id || categories[0]?.id || ''
  )
  const [tagName, setTagName] = useState('')
  const [tagDescription, setTagDescription] = useState('')
  const [tagError, setTagError] = useState<string | null>(null)
  const [tagSuccess, setTagSuccess] = useState<string | null>(null)
  const [isSubmittingTag, setIsSubmittingTag] = useState(false)

  // カテゴリ作成フォーム
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [categorySuccess, setCategorySuccess] = useState<string | null>(null)
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false)

  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTagError(null)
    setTagSuccess(null)

    if (!tagName.trim()) {
      setTagError('タグ名を入力してください')
      return
    }

    if (!selectedCategoryId) {
      setTagError('カテゴリを選択してください')
      return
    }

    setIsSubmittingTag(true)

    try {
      const result = await createTag(
        selectedCategoryId,
        tagName.trim(),
        tagDescription.trim() || undefined
      )

      if (result.success) {
        setTagSuccess('タグを作成しました')
        setTagName('')
        setTagDescription('')
      } else {
        setTagError(result.error || 'タグの作成に失敗しました')
      }
    } catch (error) {
      setTagError('タグの作成中にエラーが発生しました')
    } finally {
      setIsSubmittingTag(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCategoryError(null)
    setCategorySuccess(null)

    if (!categoryName.trim()) {
      setCategoryError('カテゴリ名を入力してください')
      return
    }

    setIsSubmittingCategory(true)

    try {
      const result = await createTagCategory(
        categoryName.trim(),
        categoryDescription.trim() || undefined
      )

      if (result.success) {
        setCategorySuccess('カテゴリを作成しました')
        setCategoryName('')
        setCategoryDescription('')
      } else {
        setCategoryError(result.error || 'カテゴリの作成に失敗しました')
      }
    } catch (error) {
      setCategoryError('カテゴリの作成中にエラーが発生しました')
    } finally {
      setIsSubmittingCategory(false)
    }
  }

  // ユーザーが作成可能なカテゴリ（システムカテゴリ + 自分のカテゴリ）
  const availableCategories = categories

  return (
    <div className="rounded-lg bg-white shadow">
      {/* タブヘッダー */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('tag')}
            className={`w-1/2 border-b-2 px-6 py-4 text-sm font-medium ${
              activeTab === 'tag'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            タグを作成
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`w-1/2 border-b-2 px-6 py-4 text-sm font-medium ${
              activeTab === 'category'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            カテゴリを作成
          </button>
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="p-6">
        {activeTab === 'tag' ? (
          <form onSubmit={handleTagSubmit} className="space-y-4">
            <div>
              <label htmlFor="tag-category" className="block text-sm font-medium text-gray-700">
                カテゴリ <span className="text-red-500">*</span>
              </label>
              <select
                id="tag-category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                disabled={isSubmittingTag}
              >
                {availableCategories.length === 0 ? (
                  <option value="">カテゴリがありません</option>
                ) : (
                  availableCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} {category.isSystem ? '(システム)' : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="tag-name" className="block text-sm font-medium text-gray-700">
                タグ名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tag-name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="例: 和食、イタリアン、簡単"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                disabled={isSubmittingTag}
              />
            </div>

            <div>
              <label htmlFor="tag-description" className="block text-sm font-medium text-gray-700">
                説明（任意）
              </label>
              <textarea
                id="tag-description"
                value={tagDescription}
                onChange={(e) => setTagDescription(e.target.value)}
                rows={2}
                placeholder="タグの説明を入力してください"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                disabled={isSubmittingTag}
              />
            </div>

            {tagError && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{tagError}</p>
              </div>
            )}

            {tagSuccess && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800">{tagSuccess}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingTag || availableCategories.length === 0}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmittingTag ? '作成中...' : 'タグを作成'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                カテゴリ名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="例: 料理ジャンル、調理時間、難易度"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                disabled={isSubmittingCategory}
              />
            </div>

            <div>
              <label htmlFor="category-description" className="block text-sm font-medium text-gray-700">
                説明（任意）
              </label>
              <textarea
                id="category-description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                rows={2}
                placeholder="カテゴリの説明を入力してください"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                disabled={isSubmittingCategory}
              />
            </div>

            {categoryError && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{categoryError}</p>
              </div>
            )}

            {categorySuccess && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800">{categorySuccess}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingCategory}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmittingCategory ? '作成中...' : 'カテゴリを作成'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
