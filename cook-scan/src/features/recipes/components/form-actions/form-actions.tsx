'use client'

import { Button } from '@/components/ui'
import { CheckIcon, CloseIcon } from '@/components/icons'
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
        <CloseIcon className="h-4 w-4" />
        キャンセル
      </Button>
      <Button
        type="submit"
        disabled={disabled}
        isLoading={isSubmitting}
        size="lg"
      >
        {!isSubmitting && (
          <CheckIcon className="h-5 w-5" />
        )}
        {isSubmitting ? '保存中...' : submitLabel}
      </Button>
    </div>
  )
}
