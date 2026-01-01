'use client'

import { Input } from '@/components/ui'
import type { IngredientInputProps } from './types'

export function IngredientInputMobile({
  ingredient,
  index,
  canDelete,
  onUpdate,
  onRemove,
}: IngredientInputProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-white via-gray-50/50 to-emerald-50/30 p-4 shadow-sm ring-1 ring-gray-200/80 transition-all duration-300 active:scale-[0.98]">
      {/* Decorative accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-green-400 via-emerald-500 to-teal-600" />

      <div className="space-y-3 pl-2">
        {/* Row 1: Name */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
            材料名
          </label>
          <Input
            type="text"
            placeholder="例: 鶏もも肉"
            value={ingredient.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            variant="green"
            size="lg"
            className="font-medium"
          />
        </div>

        {/* Row 2: Unit */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
            分量
          </label>
          <Input
            type="text"
            placeholder="例: 300g、大さじ2、適量"
            value={ingredient.unit ?? ''}
            onChange={(e) => onUpdate(index, 'unit', e.target.value)}
            variant="green"
            size="lg"
          />
        </div>

        {/* Row 3: Notes */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
            メモ
          </label>
          <Input
            type="text"
            placeholder="下処理や代替食材などのメモ..."
            value={ingredient.notes ?? ''}
            onChange={(e) => onUpdate(index, 'notes', e.target.value)}
            variant="green"
            size="lg"
          />
        </div>

        {/* Row 4: Delete button */}
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={!canDelete}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="材料を削除"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            この材料を削除
          </button>
        </div>
      </div>
    </div>
  )
}
