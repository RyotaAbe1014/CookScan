'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TrashIcon } from '@/components/icons/trash-icon'
import { ClockIcon } from '@/components/icons/clock-icon'
import type { StepInputProps } from './types'

export function StepInputMobile({
  step,
  index,
  canDelete,
  onUpdate,
  onRemove,
}: StepInputProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-white via-section-header/50 to-accent-steps-light/30 p-4 shadow-sm ring-1 ring-section-header-border/80 transition-all duration-300 active:scale-[0.99]">
      {/* Decorative accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-accent-steps via-accent-steps to-accent-steps" />

      {/* Header: Step number + Delete button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-accent-steps to-accent-steps text-lg font-bold text-white shadow-lg shadow-accent-steps/30">
            {index + 1}
          </div>
          <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            ステップ {index + 1}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canDelete}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all duration-200 hover:bg-danger-light hover:text-danger active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="手順を削除"
        >
          <TrashIcon className="h-5 w-5" stroke="currentColor" />
        </button>
      </div>

      {/* Instruction textarea (full width) */}
      <div className="mb-4">
        <label htmlFor={`step-instruction-${index}`} className="mb-1.5 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          手順の説明
        </label>
        <Textarea
          id={`step-instruction-${index}`}
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
      <div className="rounded-xl bg-linear-to-r from-accent-steps-light to-accent-steps-light p-3 ring-1 ring-accent-steps-light">
        <label htmlFor={`step-timer-${index}`} className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-primary uppercase">
          <ClockIcon className="h-4 w-4" stroke="currentColor" />
          タイマー設定
        </label>
        <div className="flex items-center gap-3">
          <Input
            id={`step-timer-${index}`}
            type="number"
            placeholder="例: 180"
            value={step.timerSeconds ?? ''}
            onChange={(e) => onUpdate(index, 'timerSeconds', e.target.value)}
            size="lg"
            className="flex-1 text-center font-medium"
          />
          <span className="shrink-0 text-base font-semibold text-primary">秒</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          調理中にタイマーを使用できます（任意）
        </p>
      </div>
    </div>
  )
}
