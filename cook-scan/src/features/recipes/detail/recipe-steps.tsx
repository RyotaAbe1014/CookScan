"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { Step } from "@/types/step";
import { StepTimer } from "./step-timer";
import { ClipboardListIcon } from "@/components/icons/clipboard-list-icon";

type RecipeStepsProps = {
  recipeId: string;
  recipeTitle: string;
  steps: Step[];
};

export function RecipeSteps({ recipeId, recipeTitle, steps }: RecipeStepsProps) {
  return (
    <Card>
      <CardHeader
        icon={<ClipboardListIcon className="h-5 w-5 text-white" />}
        iconColor="accent-steps"
        title="調理手順"
      />
      <CardContent>
        {steps.length > 0 ? (
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="group from-section-header ring-section-header-border flex gap-4 rounded-lg bg-linear-to-r to-white p-4 ring-1 transition-all hover:shadow-md"
              >
                <div className="from-accent-steps to-accent-steps flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-base font-bold text-white shadow-md">
                  {step.orderIndex}
                </div>
                <div className="flex-1">
                  <p className="text-foreground leading-relaxed">{step.instruction}</p>
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
          <p className="text-muted-foreground">調理手順が登録されていません</p>
        )}
      </CardContent>
    </Card>
  );
}
