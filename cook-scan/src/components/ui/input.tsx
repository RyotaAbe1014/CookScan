import { forwardRef, type InputHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'

const inputVariants = cva(
  // 共通スタイル
  'block w-full rounded-lg border border-gray-300 shadow-sm transition-all focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50',
  {
    variants: {
      variant: {
        // デフォルト: インディゴフォーカス
        default: 'focus:border-indigo-500 focus:ring-indigo-500/20',
        // グリーン: 材料入力用
        green: 'focus:border-green-500 focus:ring-green-500/20',
        // ブルー: 調理手順用
        blue: 'focus:border-blue-500 focus:ring-blue-500/20',
        // ディセーブル: 読み取り専用フィールド
        disabled: 'border-gray-200 bg-gray-50 text-gray-500',
      },
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 sm:text-sm',
        lg: 'px-4 py-2.5 sm:text-sm',
        xl: 'px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** アイコン用の左パディングを追加 */
  hasIcon?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, hasIcon, ...props }, ref) => {
    return (
      <input
        className={cn(
          inputVariants({ variant, size }),
          hasIcon && 'pl-10',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
