import { useState } from 'react'
import type { IngredientFormData, StepFormData, SourceInfoFormData } from '@/types/forms'
import type { ChildRecipeItem } from '@/features/recipes/components'

export type RecipeFormState = {
  title: string
  sourceInfo: SourceInfoFormData
  ingredients: IngredientFormData[]
  steps: StepFormData[]
  memo: string
  selectedTagIds: string[]
  childRecipes: ChildRecipeItem[]
}

export type UseRecipeFormOptions = {
  initialData?: Partial<RecipeFormState>
}

/**
 * レシピフォームの共通ロジックを提供するカスタムフック
 * レシピ作成・編集フォームで共有される状態管理とロジックを統合
 */
export function useRecipeForm(options: UseRecipeFormOptions = {}) {
  const { initialData = {} } = options

  // 状態管理
  const [title, setTitle] = useState(initialData.title || '')
  const [sourceInfo, setSourceInfo] = useState<SourceInfoFormData>(
    initialData.sourceInfo || {
      bookName: '',
      pageNumber: '',
      url: '',
    }
  )
  const [ingredients, setIngredients] = useState<IngredientFormData[]>(
    initialData.ingredients || []
  )
  const [steps, setSteps] = useState<StepFormData[]>(initialData.steps || [])
  const [memo, setMemo] = useState(initialData.memo || '')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData.selectedTagIds || []
  )
  const [childRecipes, setChildRecipes] = useState<ChildRecipeItem[]>(
    initialData.childRecipes || []
  )

  // 材料の操作
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', unit: '', notes: '' }])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const updateIngredient = (
    index: number,
    field: keyof IngredientFormData,
    value: string
  ) => {
    setIngredients(
      ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    )
  }

  // 手順の操作（統一されたタイマー処理とorderIndex管理）
  const addStep = () => {
    const nextOrderIndex = steps.length > 0
      ? Math.max(...steps.map(s => s.orderIndex || 0)) + 1
      : 1
    setSteps([
      ...steps,
      { instruction: '', timerSeconds: undefined, orderIndex: nextOrderIndex },
    ])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index)
      // 削除後に orderIndex を再調整
      setSteps(newSteps.map((step, i) => ({ ...step, orderIndex: i + 1 })))
    }
  }

  const updateStep = (
    index: number,
    field: keyof StepFormData,
    value: string
  ) => {
    setSteps(
      steps.map((step, i) => {
        if (i === index) {
          if (field === 'timerSeconds') {
            // 統一されたタイマー処理（NaNチェック）
            const numValue = value === '' ? undefined : Number(value)
            return {
              ...step,
              [field]: isNaN(numValue as number) ? undefined : numValue,
            }
          }
          return { ...step, [field]: value }
        }
        return step
      })
    )
  }

  // サブレシピの操作
  const addChildRecipe = (item: ChildRecipeItem) => {
    setChildRecipes([...childRecipes, item])
  }

  const removeChildRecipe = (index: number) => {
    setChildRecipes(childRecipes.filter((_, i) => i !== index))
  }

  const updateChildRecipe = (
    index: number,
    field: 'quantity' | 'notes',
    value: string
  ) => {
    setChildRecipes(
      childRecipes.map((cr, i) => (i === index ? { ...cr, [field]: value } : cr))
    )
  }

  // タグの操作
  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  return {
    // 状態
    title,
    sourceInfo,
    ingredients,
    steps,
    memo,
    selectedTagIds,
    childRecipes,
    // Setters
    setTitle,
    setSourceInfo,
    setIngredients,
    setSteps,
    setMemo,
    setSelectedTagIds,
    setChildRecipes,
    // 材料操作
    addIngredient,
    removeIngredient,
    updateIngredient,
    // 手順操作
    addStep,
    removeStep,
    updateStep,
    // サブレシピ操作
    addChildRecipe,
    removeChildRecipe,
    updateChildRecipe,
    // タグ操作
    toggleTag,
  }
}
