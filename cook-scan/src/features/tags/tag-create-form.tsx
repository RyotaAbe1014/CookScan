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
    <div className="overflow-hidden rounded-xl bg-white shadow-lg">
      {/* タブヘッダー */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('tag')}
            className={`group relative w-1/2 border-b-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'tag'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className={`h-5 w-5 ${activeTab === 'tag' ? 'text-indigo-600' : 'text-gray-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              タグを作成
            </span>
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`group relative w-1/2 border-b-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'category'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className={`h-5 w-5 ${activeTab === 'category' ? 'text-indigo-600' : 'text-gray-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              カテゴリを作成
            </span>
          </button>
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="p-8">
        {activeTab === 'tag' ? (
          <form onSubmit={handleTagSubmit} className="space-y-4">
            <div>
              <label htmlFor="tag-category" className="block text-sm font-semibold text-gray-900">
                カテゴリ <span className="text-red-500">*</span>
              </label>
              <select
                id="tag-category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
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
              <label htmlFor="tag-name" className="block text-sm font-semibold text-gray-900">
                タグ名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tag-name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="例: 和食、イタリアン、簡単"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                disabled={isSubmittingTag}
              />
            </div>

            <div>
              <label htmlFor="tag-description" className="block text-sm font-semibold text-gray-900">
                説明（任意）
              </label>
              <textarea
                id="tag-description"
                value={tagDescription}
                onChange={(e) => setTagDescription(e.target.value)}
                rows={3}
                placeholder="タグの説明を入力してください"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                disabled={isSubmittingTag}
              />
            </div>

            {tagError && (
              <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
                <svg className="h-5 w-5 shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">{tagError}</p>
              </div>
            )}

            {tagSuccess && (
              <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 ring-1 ring-green-200">
                <svg className="h-5 w-5 shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-green-800">{tagSuccess}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingTag || availableCategories.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 disabled:shadow-none"
            >
              {isSubmittingTag ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  作成中...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  タグを作成
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <label htmlFor="category-name" className="block text-sm font-semibold text-gray-900">
                カテゴリ名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="例: 料理ジャンル、調理時間、難易度"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                disabled={isSubmittingCategory}
              />
            </div>

            <div>
              <label htmlFor="category-description" className="block text-sm font-semibold text-gray-900">
                説明（任意）
              </label>
              <textarea
                id="category-description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                rows={3}
                placeholder="カテゴリの説明を入力してください"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                disabled={isSubmittingCategory}
              />
            </div>

            {categoryError && (
              <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
                <svg className="h-5 w-5 shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">{categoryError}</p>
              </div>
            )}

            {categorySuccess && (
              <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 ring-1 ring-green-200">
                <svg className="h-5 w-5 shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-green-800">{categorySuccess}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingCategory}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 disabled:shadow-none"
            >
              {isSubmittingCategory ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  作成中...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  カテゴリを作成
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
