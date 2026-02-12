'use client'

import { useState } from 'react'
import type { ShoppingItemOutput } from '@/backend/domain/shopping-items'
import { ShoppingListEmptyState } from './shopping-list-empty-state'
import { ShoppingItemRow } from './shopping-item-row'
import { AddShoppingItemForm } from './add-shopping-item-form'
import { DeleteCheckedItemsButton } from './delete-checked-items-button'
import { EditShoppingItemDialog } from './edit-shopping-item-dialog'
import { ShoppingListStatsBar } from './shopping-list-stats-bar'

type ShoppingListContentProps = {
  items: ShoppingItemOutput[]
}

export function ShoppingListContent({ items }: ShoppingListContentProps) {
  const [editingItem, setEditingItem] = useState<ShoppingItemOutput | null>(null)

  const uncheckedItems = items.filter((item) => !item.isChecked)
  const checkedItems = items.filter((item) => item.isChecked)

  return (
    <>
      <ShoppingListStatsBar totalCount={items.length} checkedCount={checkedItems.length} />

      <AddShoppingItemForm />

      {items.length === 0 ? (
        <ShoppingListEmptyState />
      ) : (
        <div className="space-y-6">
          {/* 未チェックアイテム */}
          {uncheckedItems.length > 0 && (
            <div className="rounded-xl bg-white shadow-card ring-1 ring-gray-900/5">
              <ul className="divide-y divide-gray-100">
                {uncheckedItems.map((item) => (
                  <ShoppingItemRow
                    key={item.id}
                    item={item}
                    onEdit={() => setEditingItem(item)}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* チェック済みアイテム */}
          {checkedItems.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  購入済み ({checkedItems.length})
                </h3>
                <DeleteCheckedItemsButton />
              </div>
              <div className="rounded-xl bg-white/60 shadow-sm ring-1 ring-gray-900/5">
                <ul className="divide-y divide-gray-100">
                  {checkedItems.map((item) => (
                    <ShoppingItemRow
                      key={item.id}
                      item={item}
                      onEdit={() => setEditingItem(item)}
                    />
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 編集ダイアログ */}
      <EditShoppingItemDialog
        item={editingItem}
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
      />
    </>
  )
}
