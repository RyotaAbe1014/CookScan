import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ClipboardListIcon } from "@/components/icons/clipboard-list-icon";
import { PlusIcon } from "@/components/icons/plus-icon";
import { StepInput } from "./step-input";
import type { StepFormData } from "@/types/forms";

type Props = {
  steps: StepFormData[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof StepFormData, value: string) => void;
  onRemove: (index: number) => void;
};

export function StepSection({ steps, onAdd, onUpdate, onRemove }: Props) {
  return (
    <Card>
      <CardHeader
        icon={<ClipboardListIcon className="h-5 w-5 text-white" />}
        iconColor="accent-steps"
        title="調理手順"
        actions={
          <button
            type="button"
            onClick={onAdd}
            className="from-accent-steps to-accent-steps shadow-accent-steps/30 hover:shadow-accent-steps/40 inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
          >
            <PlusIcon className="h-4 w-4" stroke="currentColor" />
            手順を追加
          </button>
        }
      />
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <StepInput
              key={step.id}
              step={step}
              index={index}
              canDelete={steps.length > 1}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
