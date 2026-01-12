import { type ReactNode } from 'react'
import { cn } from '@/lib/tailwind'

export type FormFieldProps = {
  /** フィールドのラベル */
  label: string
  /** 入力要素のID（label のfor属性用） */
  htmlFor?: string
  /** 必須フィールドかどうか */
  required?: boolean
  /** ラベルの前に表示するアイコン */
  icon?: ReactNode
  /** アイコンの色クラス */
  iconColorClass?: string
  /** 子要素（入力コンポーネント） */
  children: ReactNode
  /** 追加のクラス名 */
  className?: string
  /** ラベルのスタイルバリアント */
  labelVariant?: 'default' | 'semibold' | 'compact'
}

export function FormField({
  label,
  htmlFor,
  required = false,
  icon,
  iconColorClass = 'text-primary',
  children,
  className,
  labelVariant = 'default',
}: FormFieldProps) {
  const labelClasses = cn(
    'flex items-center gap-2 font-medium text-foreground',
    {
      'mb-2 text-sm': labelVariant === 'default',
      'mb-2 text-sm font-semibold': labelVariant === 'semibold',
      'mb-1 text-xs': labelVariant === 'compact',
    }
  )

  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelClasses}>
        {icon && <span className={cn('h-4 w-4', iconColorClass)}>{icon}</span>}
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      {children}
    </div>
  )
}
