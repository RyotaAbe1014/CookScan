import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { BeakerIcon } from '@/components/icons/beaker-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { IngredientInput } from './ingredient-input'
import type { IngredientFormData } from '@/types/forms'

type Props = {
  ingredients: IngredientFormData[]
  onAdd: () => void
  onUpdate: (index: number, field: keyof IngredientFormData, value: string) => void
  onRemove: (index: number) => void
}

export function IngredientSection({ ingredients, onAdd, onUpdate, onRemove }: Props) {
  return (
    <Card>
      <CardHeader
        icon={<BeakerIcon className="h-5 w-5 text-white" />}
        iconColor="green"
        title="材料"
        actions={
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-green-600 to-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-green-500/30 transition-all hover:shadow-lg hover:shadow-green-500/40"
          >
            <PlusIcon className="h-4 w-4" stroke="currentColor" />
            材料を追加
          </button>
        }
      />
      <CardContent>
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <IngredientInput
              key={ingredient.id}
              ingredient={ingredient}
              index={index}
              canDelete={ingredients.length > 1}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
