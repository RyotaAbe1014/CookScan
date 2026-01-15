'use client'

import { Input } from '@/components/ui/input'
import { TrashIcon } from '@/components/icons/trash-icon'
import type { IngredientInputProps } from './types'

export function IngredientInput({
  ingredient,
  index,
  canDelete,
  onUpdate,
  onRemove,
}: IngredientInputProps) {
  return (
    <div className="group flex gap-3 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 ring-1 ring-gray-200 transition-all hover:shadow-md">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="材料名"
          value={ingredient.name}
          onChange={(e) => onUpdate(index, 'name', e.target.value)}
          variant="green"
          size="md"
        />
      </div>
      <div className="w-32">
        <Input
          type="text"
          placeholder="分量"
          value={ingredient.unit ?? ''}
          onChange={(e) => onUpdate(index, 'unit', e.target.value)}
          variant="green"
          size="md"
        />
      </div>
      <div className="flex-1">
        <Input
          type="text"
          placeholder="メモ"
          value={ingredient.notes ?? ''}
          onChange={(e) => onUpdate(index, 'notes', e.target.value)}
          variant="green"
          size="md"
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canDelete}
        className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="材料を削除"
      >
        <TrashIcon className="h-5 w-5" stroke="currentColor" />
      </button>
    </div>
  )
}
