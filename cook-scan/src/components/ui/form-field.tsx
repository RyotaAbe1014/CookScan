import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
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
  iconColorClass = 'text-indigo-600',
  children,
  className,
  labelVariant = 'default',
}: FormFieldProps) {
  const labelClasses = cn(
    'flex items-center gap-1.5 text-sm font-medium text-gray-700',
    {
      'mb-2': labelVariant === 'default',
      'mb-2 font-semibold text-gray-900': labelVariant === 'semibold',
      'text-xs mb-1': labelVariant === 'compact',
    }
  )

  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelClasses}>
        {icon && <span className={cn('h-4 w-4', iconColorClass)}>{icon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}
