'use client'

import { useState } from 'react'
import { updateTagCategory, deleteTagCategory } from './actions'
import { TagItem } from './tag-item'
import { Button, Input, Textarea } from '@/components/ui'

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
    <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5 transition-all hover:shadow-xl">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
        {isEditing ? (
          <form onSubmit={handleEdit} className="space-y-3">
            <div>
              <label htmlFor={`edit-category-name-${category.id}`} className="block text-sm font-medium text-gray-700">
                カテゴリ名
              </label>
              <Input
                type="text"
                id={`edit-category-name-${category.id}`}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1"
                size="md"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor={`edit-category-description-${category.id}`} className="block text-sm font-medium text-gray-700">
                説明（任意）
              </label>
              <Textarea
                id={`edit-category-description-${category.id}`}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
                className="mt-1"
                size="md"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                size="sm"
              >
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
                size="sm"
              >
                キャンセル
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {category.name}
                </h3>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  {category.isSystem ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      システム
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      ユーザー
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 shadow-sm">
                <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm font-semibold text-indigo-900">
                  {category.tags.length}
                </span>
              </div>
              {isUserOwned && !category.isSystem && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg p-2 transition-colors hover:bg-indigo-100"
                    title="編集"
                    disabled={isSubmitting}
                  >
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-lg p-2 transition-colors hover:bg-red-100"
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
