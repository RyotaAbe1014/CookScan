'use client'

import { Button } from '@/components/ui'
import { CheckIcon, CloseIcon } from '@/components/icons'
import type { FormActionsProps } from './types'

export function FormActionsMobile({
  isSubmitting,
  disabled,
  submitLabel,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="space-y-3">
      {/* Primary action: Save button (on top for thumb reach) */}
      <Button
        type="submit"
        disabled={disabled}
        isLoading={isSubmitting}
        size="lg"
        className="w-full py-4 text-base"
      >
        {!isSubmitting && (
          <CheckIcon className="h-5 w-5" />
        )}
        {isSubmitting ? '保存中...' : submitLabel}
      </Button>

      {/* Secondary action: Cancel button */}
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        size="lg"
        className="w-full py-4 text-base"
      >
        <CloseIcon className="h-4 w-4" />
        キャンセル
      </Button>
    </div>
  )
}
