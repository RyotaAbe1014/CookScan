'use client'

import { Input, Textarea } from '@/components/ui'
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
          <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
