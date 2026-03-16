"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrashIcon } from "@/components/icons/trash-icon";
import { ClockIcon } from "@/components/icons/clock-icon";
import type { StepInputProps } from "./types";

export function StepInput({ step, index, canDelete, onUpdate, onRemove }: StepInputProps) {
  return (
    <div className="group from-section-header ring-section-header-border flex gap-3 rounded-lg bg-linear-to-r to-white p-4 ring-1 transition-all hover:shadow-md">
      <div className="from-accent-steps to-accent-steps flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-base font-bold text-white shadow-md">
        {index + 1}
      </div>
      <div className="flex-1 space-y-3">
        <Textarea
          placeholder="手順の説明"
          value={step.instruction}
          onChange={(e) => onUpdate(index, "instruction", e.target.value)}
          rows={2}
          variant="blue"
        />
        <div className="ring-section-header-border flex items-center gap-2 rounded-lg bg-white p-2 ring-1">
          <ClockIcon className="text-primary h-4 w-4" stroke="currentColor" />
          <Input
            type="number"
            placeholder="タイマー（秒）"
            value={step.timerSeconds ?? ""}
            onChange={(e) => onUpdate(index, "timerSeconds", e.target.value)}
            size="sm"
            className="w-28"
          />
          <span className="text-muted-foreground text-sm font-medium">秒</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canDelete}
        className="text-muted-foreground hover:bg-danger-light hover:text-danger rounded-lg p-2 transition-all disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="手順を削除"
      >
        <TrashIcon className="h-5 w-5" stroke="currentColor" />
      </button>
    </div>
  );
}
