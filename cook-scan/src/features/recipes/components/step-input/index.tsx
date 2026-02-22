'use client'

import { useIsMobile } from '@/hooks/use-media-query'
import { StepInput as DesktopStepInput } from './step-input'
import { StepInputMobile } from './step-input-mobile'
import type { StepInputProps } from './types'

export function StepInput(props: StepInputProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <StepInputMobile {...props} />
  }

  return <DesktopStepInput {...props} />
}

