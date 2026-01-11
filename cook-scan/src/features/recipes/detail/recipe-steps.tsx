'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import type { Step } from '@/types/step'
import { StepTimer } from './step-timer'
import { ClipboardListIcon } from '@/components/icons'

type RecipeStepsProps = {
  recipeId: string
  recipeTitle: string
  steps: Step[]
}

export function RecipeSteps({ recipeId, recipeTitle, steps }: RecipeStepsProps) {

  return (
    <Card>
      <CardHeader
        icon={
          <ClipboardListIcon className="h-5 w-5 text-white" />
        }
        iconColor="blue"
        title="調理手順"
      />
      <CardContent>
        {steps.length > 0 ? (
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="group flex gap-4 rounded-lg bg-linear-to-r from-gray-50 to-white p-4 ring-1 ring-gray-200 transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 text-base font-bold text-white shadow-md">
                  {step.orderIndex}
                </div>
                <div className="flex-1">
                  <p className="leading-relaxed text-gray-900">{step.instruction}</p>
                  {step.timerSeconds && (
                    <StepTimer
                      stepId={step.id}
                      recipeId={recipeId}
                      recipeTitle={recipeTitle}
                      stepNumber={step.orderIndex}
                      instruction={step.instruction}
                      timerSeconds={step.timerSeconds}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">調理手順が登録されていません</p>
        )}
      </CardContent>
    </Card>
  )
}
