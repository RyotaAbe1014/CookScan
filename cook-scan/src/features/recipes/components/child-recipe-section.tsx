import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { FolderIcon } from '@/components/icons/folder-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { ChildRecipeInput, ChildRecipeSelectorDialog } from './child-recipe-input'
import type { ChildRecipeItem } from './child-recipe-input'

type Props = {
  childRecipes: ChildRecipeItem[]
  isDialogOpen: boolean
  onOpenDialog: () => void
  onCloseDialog: () => void
  onAdd: (item: ChildRecipeItem) => void
  onUpdate: (index: number, field: 'quantity' | 'notes', value: string) => void
  onRemove: (index: number) => void
  parentRecipeId?: string
}

export function ChildRecipeSection({
  childRecipes,
  isDialogOpen,
  onOpenDialog,
  onCloseDialog,
  onAdd,
  onUpdate,
  onRemove,
  parentRecipeId,
}: Props) {
  return (
    <>
      <Card>
        <CardHeader
          icon={<FolderIcon className="h-5 w-5 text-white" />}
          iconColor="purple"
          title="サブレシピ"
          actions={
            <button
              type="button"
              onClick={onOpenDialog}
              className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-purple-600 to-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/40"
            >
              <PlusIcon className="h-4 w-4" stroke="currentColor" />
              サブレシピを追加
            </button>
          }
        />
        <CardContent>
          {childRecipes.length > 0 ? (
            <div className="space-y-3">
              {childRecipes.map((item, index) => (
                <ChildRecipeInput
                  key={item.childRecipeId}
                  item={item}
                  index={index}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">サブレシピが追加されていません</p>
          )}
        </CardContent>
      </Card>
      <ChildRecipeSelectorDialog
        isOpen={isDialogOpen}
        onClose={onCloseDialog}
        onAdd={onAdd}
        parentRecipeId={parentRecipeId}
        existingChildRecipeIds={childRecipes.map(cr => cr.childRecipeId)}
      />
    </>
  )
}
