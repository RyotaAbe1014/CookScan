'use client'

import { Input } from '@/components/ui/input'
import { TrashIcon } from '@/components/icons/trash-icon'
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
            <TrashIcon className="h-4 w-4" stroke="currentColor" />
            この材料を削除
          </button>
        </div>
      </div>
    </div>
  )
}
