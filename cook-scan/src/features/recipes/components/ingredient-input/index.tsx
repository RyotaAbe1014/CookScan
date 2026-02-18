'use client'

import { useIsMobile } from '@/hooks/use-media-query'
import { IngredientInput as DesktopIngredientInput } from './ingredient-input'
import { IngredientInputMobile } from './ingredient-input-mobile'
import type { IngredientInputProps } from './types'

export function IngredientInput(props: IngredientInputProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <IngredientInputMobile {...props} />
  }

  return <DesktopIngredientInput {...props} />
}

export type { IngredientInputProps, Ingredient } from './types'
