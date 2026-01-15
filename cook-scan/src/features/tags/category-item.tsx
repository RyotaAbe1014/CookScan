'use client'

import { useState } from 'react'
import { updateTagCategory, deleteTagCategory } from './actions'
import { TagItem } from './tag-item'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { FolderIcon } from '@/components/icons/folder-icon'
import { BadgeCheckIcon } from '@/components/icons/badge-check-icon'
import { UserCircleSolidIcon } from '@/components/icons/user-circle-solid-icon'
import { TagIcon } from '@/components/icons/tag-icon'
import { PencilIcon } from '@/components/icons/pencil-icon'
import { TrashIcon } from '@/components/icons/trash-icon'

type Tag = {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  userId: string | null
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
    } catch (_error) {
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
    } catch (_error) {
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
    <Card hover>
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        {isEditing ? (
          <form onSubmit={handleEdit} className="space-y-3">
            <div>
              <label htmlFor={`edit-category-name-${category.id}`} className="block text-sm font-medium text-slate-700">
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
              <label htmlFor={`edit-category-description-${category.id}`} className="block text-sm font-medium text-slate-700">
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
                <FolderIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-neutral-900">
                  {category.name}
                </h3>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  {category.isSystem ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                      <BadgeCheckIcon className="h-3 w-3" />
                      システム
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <UserCircleSolidIcon className="h-3 w-3" />
                      ユーザー
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 border border-emerald-200">
                <TagIcon className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-semibold text-neutral-900">
                  {category.tags.length}
                </span>
              </div>
              {isUserOwned && !category.isSystem && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg p-2 transition-colors hover:bg-emerald-100"
                    title="編集"
                    disabled={isSubmitting}
                  >
                    <PencilIcon className="h-5 w-5 text-emerald-600" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-lg p-2 transition-colors hover:bg-red-100"
                    title="削除"
                    disabled={isSubmitting}
                  >
                    <TrashIcon className="h-5 w-5 text-red-600" />
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

      <CardContent padding="sm" className="px-6">
        {category.tags.length === 0 ? (
          <p className="text-sm text-slate-500">
            このカテゴリにはまだタグがありません。
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {category.tags.map((tag) => {
              const usageCount = tag.recipeTags.length
              const isTagUserOwned = tag.userId === currentUserId

              return (
                <TagItem
                  key={tag.id}
                  tag={tag}
                  usageCount={usageCount}
                  isUserOwned={isTagUserOwned}
                />
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
