'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { StepTimer } from './step-timer'

type Step = {
  id: string
  orderIndex: number
  instruction: string
  timerSeconds: number | null
}

type RecipeStepsProps = {
  recipeId: string
  steps: Step[]
}

export function RecipeSteps({ recipeId, steps }: RecipeStepsProps) {

  return (
    <Card>
      <CardHeader
        icon={
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
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
