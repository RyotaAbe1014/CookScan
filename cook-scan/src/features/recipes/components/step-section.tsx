import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { ClipboardListIcon } from '@/components/icons/clipboard-list-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { StepInput } from './step-input'
import type { StepFormData } from '@/types/forms'

type Props = {
  steps: StepFormData[]
  onAdd: () => void
  onUpdate: (index: number, field: keyof StepFormData, value: string) => void
  onRemove: (index: number) => void
}

export function StepSection({ steps, onAdd, onUpdate, onRemove }: Props) {
  return (
    <Card>
      <CardHeader
        icon={<ClipboardListIcon className="h-5 w-5 text-white" />}
        iconColor="blue"
        title="調理手順"
        actions={
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/40"
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
  )
}
