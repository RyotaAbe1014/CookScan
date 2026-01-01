'use client'

import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-media-query'
import { StepInput as DesktopStepInput } from './step-input'
import { StepInputMobile } from './step-input-mobile'
import type { StepInputProps } from './types'

export function StepInput(props: StepInputProps) {
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render desktop version before mount to avoid hydration mismatch
  if (!mounted) {
    return <DesktopStepInput {...props} />
  }

  if (isMobile) {
    return <StepInputMobile {...props} />
  }

  return <DesktopStepInput {...props} />
}

export type { StepInputProps, Step } from './types'
