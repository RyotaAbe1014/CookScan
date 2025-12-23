import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'

const buttonVariants = cva(
  // 共通スタイル
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        // プライマリ: グラデーション付きメインボタン
        primary:
          'bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-primary hover:shadow-primary-hover',
        // セカンダリ: 白背景のボタン
        secondary:
          'border border-border-dark bg-white text-foreground shadow-sm hover:bg-muted hover:text-primary',
        // ゴースト: 背景なしのボタン
        ghost:
          'text-muted-foreground hover:bg-muted hover:text-foreground',
        // デンジャー: 削除などの危険なアクション
        danger:
          'bg-danger text-danger-foreground shadow-danger hover:bg-danger-hover hover:shadow-danger-hover',
        // デンジャーゴースト: 削除アクションのゴースト版
        'danger-ghost':
          'text-danger hover:bg-danger-light hover:text-danger-hover',
        // リンク: テキストリンクスタイル
        link:
          'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** ローディング状態 */
    isLoading?: boolean
  }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
