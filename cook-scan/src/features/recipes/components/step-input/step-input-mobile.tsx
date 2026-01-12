'use client'

import { Input, Textarea } from '@/components/ui'
import { TrashIcon, ClockIcon } from '@/components/icons'
import type { StepInputProps } from './types'

export function StepInputMobile({
  step,
  index,
  canDelete,
  onUpdate,
  onRemove,
}: StepInputProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-white via-gray-50/50 to-blue-50/30 p-4 shadow-sm ring-1 ring-gray-200/80 transition-all duration-300 active:scale-[0.99]">
      {/* Decorative accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-blue-400 via-indigo-500 to-purple-600" />

      {/* Header: Step number + Delete button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-500/30">
            {index + 1}
          </div>
          <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            ステップ {index + 1}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canDelete}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="手順を削除"
        >
          <TrashIcon className="h-5 w-5" stroke="currentColor" />
        </button>
      </div>

      {/* Instruction textarea (full width) */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
          手順の説明
        </label>
        <Textarea
          placeholder="この手順で行うことを詳しく書いてください..."
          value={step.instruction}
          onChange={(e) => onUpdate(index, 'instruction', e.target.value)}
          rows={3}
          variant="blue"
          size="lg"
          className="resize-y"
        />
      </div>

      {/* Timer input (full width) */}
      <div className="rounded-xl bg-linear-to-r from-indigo-50 to-blue-50 p-3 ring-1 ring-indigo-100">
        <label className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-600 uppercase">
          <ClockIcon className="h-4 w-4" stroke="currentColor" />
          タイマー設定
        </label>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            placeholder="例: 180"
            value={step.timerSeconds ?? ''}
            onChange={(e) => onUpdate(index, 'timerSeconds', e.target.value)}
            size="lg"
            className="flex-1 text-center font-medium"
          />
          <span className="shrink-0 text-base font-semibold text-emerald-600">秒</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          調理中にタイマーを使用できます（任意）
        </p>
      </div>
    </div>
  )
}
