'use client'

import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-media-query'
import { FormActions as DesktopFormActions } from './form-actions'
import { FormActionsMobile } from './form-actions-mobile'
import type { FormActionsProps } from './types'

export function FormActions(props: FormActionsProps) {
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render desktop version before mount to avoid hydration mismatch
  if (!mounted) {
    return <DesktopFormActions {...props} />
  }

  if (isMobile) {
    return <FormActionsMobile {...props} />
  }

  return <DesktopFormActions {...props} />
}

export type { FormActionsProps } from './types'
