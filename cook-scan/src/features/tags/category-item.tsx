'use client'

import { useState } from 'react'
import { updateTagCategory, deleteTagCategory } from './actions'
import { TagItem } from './tag-item'

type Tag = {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  recipeTags: { recipeId: string }[]
}

type CategoryItemProps = {
  category: {
    id: string
    name: string
    description: string | null
    isSystem: boolean
    userId: string | null
    tags: Tag[]
  }
  currentUserId: string
}

export function CategoryItem({ category, currentUserId }: CategoryItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(category.name)
  const [editDescription, setEditDescription] = useState(category.description || '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUserOwned = category.userId === currentUserId

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!editName.trim()) {
      setError('カテゴリ名を入力してください')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateTagCategory(
        category.id,
        editName.trim(),
        editDescription.trim() || undefined
      )

      if (result.success) {
        setIsEditing(false)
      } else {
        setError(result.error || 'カテゴリの更新に失敗しました')
      }
    } catch (error) {
      setError('カテゴリの更新中にエラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`カテゴリ「${category.name}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await deleteTagCategory(category.id)

      if (!result.success) {
        setError(result.error || 'カテゴリの削除に失敗しました')
        setIsSubmitting(false)
      }
      // 成功時はページがリロードされるのでローディング状態を維持
    } catch (error) {
      setError('カテゴリの削除中にエラーが発生しました')
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditName(category.name)
    setEditDescription(category.description || '')
    setError(null)
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        {isEditing ? (
          <form onSubmit={handleEdit} className="space-y-3">
            <div>
              <label htmlFor={`edit-category-name-${category.id}`} className="block text-sm font-medium text-gray-700">
                カテゴリ名
              </label>
              <input
                type="text"
                id={`edit-category-name-${category.id}`}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor={`edit-category-description-${category.id}`} className="block text-sm font-medium text-gray-700">
                説明（任意）
              </label>
              <textarea
                id={`edit-category-description-${category.id}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400"
              >
                {isSubmitting ? '保存中...' : '保存'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 disabled:bg-gray-100"
              >
                キャンセル
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {category.isSystem ? 'システム提供のタグカテゴリです' : 'あなたが作成したタグカテゴリです'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                タグ {category.tags.length} 件
              </span>
              {isUserOwned && !category.isSystem && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded p-2 hover:bg-gray-100"
                    title="編集"
                    disabled={isSubmitting}
                  >
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded p-2 hover:bg-red-100"
                    title="削除"
                    disabled={isSubmitting}
                  >
                    <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {error && !isEditing && (
          <div className="mt-2 rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4">
        {category.tags.length === 0 ? (
          <p className="text-sm text-gray-500">
            このカテゴリにはまだタグがありません。
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {category.tags.map((tag) => {
              const usageCount = tag.recipeTags.length

              return (
                <TagItem
                  key={tag.id}
                  tag={tag}
                  usageCount={usageCount}
                  isUserOwned={isUserOwned}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
