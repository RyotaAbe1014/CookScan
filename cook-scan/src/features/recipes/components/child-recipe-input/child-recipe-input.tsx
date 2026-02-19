'use client'

import { Input } from '@/components/ui/input'
import { TrashIcon } from '@/components/icons/trash-icon'
import type { ChildRecipeInputProps } from './types'

export function ChildRecipeInput({ item, index, onUpdate, onRemove }: ChildRecipeInputProps) {
  return (
    <div className="rounded-lg bg-linear-to-r from-purple-50 to-white p-4 ring-1 ring-purple-200">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span className="font-semibold text-gray-900">{item.childRecipeTitle}</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label={`${item.childRecipeTitle}を削除`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`child-recipe-quantity-${index}`} className="mb-1 block text-xs font-medium text-gray-600">分量</label>
          <Input
            id={`child-recipe-quantity-${index}`}
            type="text"
            value={item.quantity}
            onChange={(e) => onUpdate(index, 'quantity', e.target.value)}
            placeholder="例: 大さじ2"
          />
        </div>
        <div>
          <label htmlFor={`child-recipe-notes-${index}`} className="mb-1 block text-xs font-medium text-gray-600">メモ</label>
          <Input
            id={`child-recipe-notes-${index}`}
            type="text"
            value={item.notes}
            onChange={(e) => onUpdate(index, 'notes', e.target.value)}
            placeholder="例: 事前に作っておく"
          />
        </div>
      </div>
    </div>
  )
}
