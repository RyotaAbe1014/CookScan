'use client'

import { Input } from '@/components/ui'
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
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
