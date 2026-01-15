'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TrashIcon } from '@/components/icons/trash-icon'
import { ClockIcon } from '@/components/icons/clock-icon'
import type { StepInputProps } from './types'

export function StepInput({
  step,
  index,
  canDelete,
  onUpdate,
  onRemove,
}: StepInputProps) {
  return (
    <div className="group flex gap-3 rounded-lg bg-linear-to-r from-gray-50 to-white p-4 ring-1 ring-gray-200 transition-all hover:shadow-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 text-base font-bold text-white shadow-md">
        {index + 1}
      </div>
      <div className="flex-1 space-y-3">
        <Textarea
          placeholder="手順の説明"
          value={step.instruction}
          onChange={(e) => onUpdate(index, 'instruction', e.target.value)}
          rows={2}
          variant="blue"
        />
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 ring-1 ring-gray-200">
          <ClockIcon className="h-4 w-4 text-emerald-600" stroke="currentColor" />
          <Input
            type="number"
            placeholder="タイマー（秒）"
            value={step.timerSeconds ?? ''}
            onChange={(e) => onUpdate(index, 'timerSeconds', e.target.value)}
            size="sm"
            className="w-28"
          />
          <span className="text-sm font-medium text-gray-600">秒</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canDelete}
        className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="手順を削除"
      >
        <TrashIcon className="h-5 w-5" stroke="currentColor" />
      </button>
    </div>
  )
}
