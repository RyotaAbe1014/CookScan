'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateTag, deleteTag } from './actions'
import { isSuccess } from '@/utils/result'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TagIcon } from '@/components/icons/tag-icon'
import { BookOpenIcon } from '@/components/icons/book-open-icon'
import { PencilIcon } from '@/components/icons/pencil-icon'
import { TrashIcon } from '@/components/icons/trash-icon'

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editName.trim()) {
      toast.error('タグ名を入力してください')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateTag(tag.id, editName.trim(), editDescription.trim() || undefined)

      if (isSuccess(result)) {
        setIsEditing(false)
      } else {
        toast.error(result.error.message)
      }
    } catch {
      toast.error('タグの更新中にエラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`「${tag.name}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await deleteTag(tag.id)

      if (!isSuccess(result)) {
        toast.error(result.error.message)
        setIsSubmitting(false)
      }
      // 成功時はページがリロードされるのでローディング状態を維持
    } catch {
      toast.error('タグの削除中にエラーが発生しました')
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditName(tag.name)
    setEditDescription(tag.description || '')
  }

  if (isEditing) {
    return (
      <div className="rounded-lg border-2 border-primary-light bg-white p-4">
        <form onSubmit={handleEdit} className="space-y-3">
          <div>
            <label
              htmlFor={`edit-tag-name-${tag.id}`}
              className="block text-xs font-medium text-muted-foreground"
            >
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
            <label
              htmlFor={`edit-tag-description-${tag.id}`}
              className="block text-xs font-medium text-muted-foreground"
            >
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

          <div className="flex gap-2">
            <Button type="submit" isLoading={isSubmitting} size="sm">
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
    <div className="group relative inline-flex items-center gap-2 rounded-lg border border-primary-light bg-primary-light px-4 py-2.5 transition-all hover:border-primary-light hover:shadow-sm">
      <TagIcon className="h-4 w-4 text-primary" />
      <span className="font-semibold text-foreground">{tag.name}</span>
      <div className="flex items-center gap-1 rounded-md border border-border bg-white px-2 py-1">
        <BookOpenIcon className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-bold text-foreground">{usageCount}</span>
      </div>

      {isUserOwned && !tag.isSystem && (
        <div className="ml-1 flex gap-0.5">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md p-1.5 transition-colors hover:bg-primary-light"
            title="編集"
            disabled={isSubmitting}
          >
            <PencilIcon className="h-4 w-4 text-primary-hover" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md p-1.5 transition-colors hover:bg-danger-light"
            title="削除"
            disabled={isSubmitting}
          >
            <TrashIcon className="h-4 w-4 text-danger" />
          </button>
        </div>
      )}
    </div>
  )
}
