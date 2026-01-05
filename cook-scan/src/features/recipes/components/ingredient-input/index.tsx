'use client'

import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-media-query'
import { IngredientInput as DesktopIngredientInput } from './ingredient-input'
import { IngredientInputMobile } from './ingredient-input-mobile'
import type { IngredientInputProps } from './types'

export function IngredientInput(props: IngredientInputProps) {
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  // ハイドレーションミスマッチを防ぐため、マウント後にのみ状態を更新
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Render desktop version before mount to avoid hydration mismatch
  if (!mounted) {
    return <DesktopIngredientInput {...props} />
  }

  if (isMobile) {
    return <IngredientInputMobile {...props} />
  }

  return <DesktopIngredientInput {...props} />
}

export type { IngredientInputProps, Ingredient } from './types'
