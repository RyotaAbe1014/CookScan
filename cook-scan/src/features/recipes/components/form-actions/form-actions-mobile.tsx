'use client'

import { Button } from '@/components/ui'
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
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
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
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        キャンセル
      </Button>
    </div>
  )
}
