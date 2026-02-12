'use client'

import { useTransition } from 'react'
import type { ShoppingItemOutput } from '@/backend/domain/shopping-items'
import { updateShoppingItemCheck, deleteShoppingItem } from '@/features/shopping-list/actions'
import { isSuccess } from '@/utils/result'
import { Button } from '@/components/ui/button'
import { CheckIcon } from '@/components/icons/check-icon'
import { PencilIcon } from '@/components/icons/pencil-icon'
import { TrashIcon } from '@/components/icons/trash-icon'
import { cn } from '@/lib/tailwind'

type ShoppingItemRowProps = {
  item: ShoppingItemOutput
  onEdit: () => void
}

export function ShoppingItemRow({ item, onEdit }: ShoppingItemRowProps) {
  const [isCheckPending, startCheckTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()

  const handleToggleCheck = () => {
    startCheckTransition(async () => {
      await updateShoppingItemCheck(item.id, !item.isChecked)
    })
  }

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteShoppingItem(item.id)
      if (!isSuccess(result)) {
        console.error('Failed to delete item:', result.error.message)
      }
    })
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-gray-50">
      {/* チェックボックス */}
      <button
        type="button"
        onClick={handleToggleCheck}
        disabled={isCheckPending}
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          item.isChecked
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-gray-300 bg-white hover:border-emerald-400',
          isCheckPending && 'opacity-50'
        )}
        aria-label={item.isChecked ? 'チェックを外す' : 'チェックする'}
      >
        {item.isChecked && <CheckIcon className="h-4 w-4" />}
      </button>

      {/* アイテム情報 */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium transition-colors duration-200',
            item.isChecked ? 'text-muted-foreground line-through' : 'text-foreground'
          )}
        >
          {item.name}
        </p>
        {item.memo && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {item.memo}
          </p>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8"
          aria-label="編集"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="danger-ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeletePending}
          isLoading={isDeletePending}
          className="h-8 w-8"
          aria-label="削除"
        >
          {!isDeletePending && <TrashIcon className="h-4 w-4" />}
        </Button>
      </div>
    </li>
  )
}
