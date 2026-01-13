import { atom } from 'jotai'
import { timerStatesAtom } from '@/features/recipes/detail/atoms/timer-atoms'

// アクティブタイマーを持つレシピの情報を取得するatom
// { recipeId, recipeTitle, timerCount } の配列を返す
export const activeTimerRecipesAtom = atom((get) => {
  const allStates = get(timerStatesAtom)
  const recipes: Array<{ recipeId: string; recipeTitle: string; timerCount: number }> = []

  allStates.forEach((states, recipeId) => {
    if (states.size > 0) {
      // 最初のタイマーからレシピ名を取得（全て同じレシピ名のはず）
      const firstTimer = Array.from(states.values())[0]
      recipes.push({
        recipeId,
        recipeTitle: firstTimer.recipeTitle,
        timerCount: states.size,
      })
    }
  })

  return recipes
})
