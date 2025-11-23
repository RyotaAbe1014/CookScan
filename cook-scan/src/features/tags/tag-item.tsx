'use client'

import { useState } from 'react'
import { updateTag, deleteTag } from './actions'

type TagItemProps = {
  tag: {
    id: string
    name: string
    description: string | null
    isSystem: boolean
  }
  usageCount: number
  isUserOwned: boolean
}

export function TagItem({ tag, usageCount, isUserOwned }: TagItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(tag.name)
  const [editDescription, setEditDescription] = useState(tag.description || '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!editName.trim()) {
      setError('タグ名を入力してください')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateTag(
        tag.id,
        editName.trim(),
        editDescription.trim() || undefined
      )

      if (result.success) {
        setIsEditing(false)
      } else {
        setError(result.error || 'タグの更新に失敗しました')
      }
    } catch (error) {
      setError('タグの更新中にエラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`「${tag.name}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await deleteTag(tag.id)

      if (!result.success) {
        setError(result.error || 'タグの削除に失敗しました')
        setIsSubmitting(false)
      }
      // 成功時はページがリロードされるのでローディング状態を維持
    } catch (error) {
      setError('タグの削除中にエラーが発生しました')
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditName(tag.name)
    setEditDescription(tag.description || '')
    setError(null)
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border-2 border-indigo-300 bg-white p-4">
        <form onSubmit={handleEdit} className="space-y-3">
          <div>
            <label htmlFor={`edit-tag-name-${tag.id}`} className="block text-xs font-medium text-gray-700">
              タグ名
            </label>
            <input
              type="text"
              id={`edit-tag-name-${tag.id}`}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor={`edit-tag-description-${tag.id}`} className="block text-xs font-medium text-gray-700">
              説明（任意）
            </label>
            <textarea
              id={`edit-tag-description-${tag.id}`}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400"
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-300 disabled:bg-gray-100"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="group inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
      <span>{tag.name}</span>
      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-indigo-600">
        {usageCount} 件のレシピ
      </span>

      {isUserOwned && !tag.isSystem && (
        <div className="ml-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded p-1 hover:bg-indigo-100"
            title="編集"
            disabled={isSubmitting}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="rounded p-1 hover:bg-red-100 hover:text-red-700"
            title="削除"
            disabled={isSubmitting}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {error && !isEditing && (
        <div className="absolute mt-2 rounded-md bg-red-50 p-2">
          <p className="text-xs text-red-800">{error}</p>
        </div>
      )}
    </div>
  )
}
