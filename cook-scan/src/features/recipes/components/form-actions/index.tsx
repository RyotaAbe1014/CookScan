'use client'

import { useIsMobile } from '@/hooks/use-media-query'
import { FormActions as DesktopFormActions } from './form-actions'
import { FormActionsMobile } from './form-actions-mobile'
import type { FormActionsProps } from './types'

export function FormActions(props: FormActionsProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <FormActionsMobile {...props} />
  }

  return <DesktopFormActions {...props} />
}

export type { FormActionsProps } from './types'
