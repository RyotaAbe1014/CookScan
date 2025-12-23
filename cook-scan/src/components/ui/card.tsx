import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'

/* =============================================================================
 * Card
 * ============================================================================= */

const cardVariants = cva(
  'overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5',
  {
    variants: {
      hover: {
        true: 'transition-all hover:shadow-xl',
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
 * アイコンバッジのグラデーションカラープリセット
 */
export type CardHeaderColor =
  | 'indigo' // 基本情報、画像など
  | 'amber' // タグ、カテゴリ、ソース情報
  | 'green' // 材料
  | 'blue' // 手順
  | 'purple' // メモ
  | 'red' // 削除、警告

const iconGradientColors: Record<CardHeaderColor, string> = {
  indigo: 'from-indigo-500 to-purple-600',
  amber: 'from-amber-500 to-orange-600',
  green: 'from-green-500 to-emerald-600',
  blue: 'from-blue-500 to-indigo-600',
  purple: 'from-purple-500 to-pink-600',
  red: 'from-red-500 to-orange-600',
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
  ({ className, icon, iconColor = 'indigo', title, actions, children, ...props }, ref) => {
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
            <div className="flex items-center gap-2">
              {icon && (
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg shadow-md bg-linear-to-br',
                    iconGradientColors[iconColor]
                  )}
                >
                  {icon}
                </div>
              )}
              {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
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
