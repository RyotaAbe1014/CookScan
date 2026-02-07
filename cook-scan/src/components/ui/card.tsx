import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'

/* =============================================================================
 * Card
 * ============================================================================= */

const cardVariants = cva(
  'overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-gray-900/5',
  {
    variants: {
      hover: {
        true: 'transition-all duration-200 hover:shadow-lg',
        false: '',
      },
    },
    defaultVariants: {
      hover: false,
    },
  }
)

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ hover, className }))}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

/* =============================================================================
 * CardHeader
 * ============================================================================= */

/**
 * アイコンバッジのカラープリセット（単色ベース）
 */
export type CardHeaderColor =
  | 'emerald' // 基本情報、画像など
  | 'amber' // タグ、カテゴリ、ソース情報
  | 'green' // 材料
  | 'blue' // 手順
  | 'teal' // メモ
  | 'red' // 削除、警告
  | 'purple' // サブレシピ（子レシピ）
  | 'indigo' // 親レシピ参照

const iconColors: Record<CardHeaderColor, string> = {
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-500',
  green: 'bg-emerald-500',
  blue: 'bg-sky-500',
  teal: 'bg-teal-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500',
}

export type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** アイコンバッジに表示するアイコン（SVG要素） */
  icon?: ReactNode
  /** アイコンバッジのグラデーションカラー */
  iconColor?: CardHeaderColor
  /** ヘッダーのタイトル */
  title?: string
  /** ヘッダー右側に配置するアクション要素 */
  actions?: ReactNode
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon, iconColor = 'emerald', title, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'border-b border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-4',
          className
        )}
        {...props}
      >
        {children ?? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && (
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg shadow-md transition-transform duration-150 hover:scale-105',
                    iconColors[iconColor]
                  )}
                >
                  {icon}
                </div>
              )}
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
      </div>
    )
  }
)
CardHeader.displayName = 'CardHeader'

/* =============================================================================
 * CardContent
 * ============================================================================= */

const cardContentVariants = cva('', {
  variants: {
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
})

export type CardContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardContentVariants>

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardContentVariants({ padding, className }))}
        {...props}
      />
    )
  }
)
CardContent.displayName = 'CardContent'

export { Card, cardVariants, CardHeader, CardContent, cardContentVariants }
