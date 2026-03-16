"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrashIcon } from "@/components/icons/trash-icon";
import { ClockIcon } from "@/components/icons/clock-icon";
import type { StepInputProps } from "./types";

export function StepInputMobile({ step, index, canDelete, onUpdate, onRemove }: StepInputProps) {
  return (
    <div className="group via-section-header/50 to-accent-steps-light/30 ring-section-header-border/80 relative overflow-hidden rounded-2xl bg-linear-to-br from-white p-4 shadow-sm ring-1 transition-all duration-300 active:scale-[0.99]">
      {/* Decorative accent */}
      <div className="from-accent-steps via-accent-steps to-accent-steps absolute top-0 left-0 h-full w-1 bg-linear-to-b" />

      {/* Header: Step number + Delete button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="from-accent-steps to-accent-steps shadow-accent-steps/30 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br text-lg font-bold text-white shadow-lg">
            {index + 1}
          </div>
          <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
            ステップ {index + 1}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canDelete}
          className="bg-muted text-muted-foreground hover:bg-danger-light hover:text-danger flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="手順を削除"
        >
          <TrashIcon className="h-5 w-5" stroke="currentColor" />
        </button>
      </div>

      {/* Instruction textarea (full width) */}
      <div className="mb-4">
        <label
          htmlFor={`step-instruction-${index}`}
          className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wide uppercase"
        >
          手順の説明
        </label>
        <Textarea
          id={`step-instruction-${index}`}
          placeholder="この手順で行うことを詳しく書いてください..."
          value={step.instruction}
          onChange={(e) => onUpdate(index, "instruction", e.target.value)}
          rows={3}
          variant="blue"
          size="lg"
          className="resize-y"
        />
      </div>

      {/* Timer input (full width) */}
      <div className="from-accent-steps-light to-accent-steps-light ring-accent-steps-light rounded-xl bg-linear-to-r p-3 ring-1">
        <label
          htmlFor={`step-timer-${index}`}
          className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide uppercase"
        >
          <ClockIcon className="h-4 w-4" stroke="currentColor" />
          タイマー設定
        </label>
        <div className="flex items-center gap-3">
          <Input
            id={`step-timer-${index}`}
            type="number"
            placeholder="例: 180"
            value={step.timerSeconds ?? ""}
            onChange={(e) => onUpdate(index, "timerSeconds", e.target.value)}
            size="lg"
            className="flex-1 text-center font-medium"
          />
          <span className="text-primary shrink-0 text-base font-semibold">秒</span>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">調理中にタイマーを使用できます（任意）</p>
      </div>
    </div>
  );
}
