'use client'

import { Button } from '@/components/ui'
import type { FormActionsProps } from './types'

export function FormActions({
  isSubmitting,
  disabled,
  submitLabel,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        size="lg"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        キャンセル
      </Button>
      <Button
        type="submit"
        disabled={disabled}
        isLoading={isSubmitting}
        size="lg"
      >
        {!isSubmitting && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isSubmitting ? '保存中...' : submitLabel}
      </Button>
    </div>
  )
}
