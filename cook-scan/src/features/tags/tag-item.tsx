'use client'

import { useState } from 'react'
import { updateTag, deleteTag } from './actions'
import { Button, Input, Textarea } from '@/components/ui'

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
    } catch (_error) {
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
    } catch (_error) {
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
            <Input
              type="text"
              id={`edit-tag-name-${tag.id}`}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="mt-1"
              size="sm"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor={`edit-tag-description-${tag.id}`} className="block text-xs font-medium text-gray-700">
              説明（任意）
            </label>
            <Textarea
              id={`edit-tag-description-${tag.id}`}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={2}
              className="mt-1"
              size="sm"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
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
      </div>
    )
  }

  return (
    <div className="group relative inline-flex items-center gap-2 rounded-lg bg-linear-to-br from-indigo-50 to-purple-50 px-4 py-2.5 shadow-sm ring-1 ring-indigo-200/50 transition-all hover:shadow-md hover:ring-indigo-300">
      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <span className="font-semibold text-indigo-900">{tag.name}</span>
      <div className="flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm">
        <svg className="h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="text-xs font-bold text-indigo-700">{usageCount}</span>
      </div>

      {isUserOwned && !tag.isSystem && (
        <div className="ml-1 flex gap-0.5 opacity-0 transition-all group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md p-1.5 transition-colors hover:bg-indigo-200"
            title="編集"
            disabled={isSubmitting}
          >
            <svg className="h-4 w-4 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md p-1.5 transition-colors hover:bg-red-200"
            title="削除"
            disabled={isSubmitting}
          >
            <svg className="h-4 w-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {error && !isEditing && (
        <div className="absolute left-0 top-full z-10 mt-2 rounded-lg bg-red-50 p-3 shadow-lg ring-1 ring-red-200">
          <p className="text-xs font-medium text-red-800">{error}</p>
        </div>
      )}
    </div>
  )
}
