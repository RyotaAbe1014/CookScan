import { type HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'

const alertVariants = cva(
  // 共通スタイル
  'flex items-start gap-3 rounded-lg p-4 ring-1',
  {
    variants: {
      variant: {
        // エラー: 赤系
        error: 'bg-red-50 ring-red-200',
        // 成功: 緑系
        success: 'bg-green-50 ring-green-200',
        // 警告: 黄色系
        warning: 'bg-yellow-50 ring-yellow-200',
        // 情報: 青系
        info: 'bg-blue-50 ring-blue-200',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

const alertIconVariants = cva('h-5 w-5 shrink-0', {
  variants: {
    variant: {
      error: 'text-red-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

const alertTextVariants = cva('text-sm font-medium', {
  variants: {
    variant: {
      error: 'text-red-800',
      success: 'text-green-800',
      warning: 'text-yellow-800',
      info: 'text-blue-800',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

// SVG アイコンコンポーネント
const AlertIcons = {
  error: (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  success: (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  info: (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
}

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** アイコンを非表示にする */
  hideIcon?: boolean
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, hideIcon, children, ...props }, ref) => {
    const iconVariant = variant || 'info'

    return (
      <div
        className={cn(alertVariants({ variant, className }))}
        ref={ref}
        role="alert"
        {...props}
      >
        {!hideIcon && (
          <span className={cn(alertIconVariants({ variant: iconVariant }))}>
            {AlertIcons[iconVariant]}
          </span>
        )}
        <p className={cn(alertTextVariants({ variant: iconVariant }))}>{children}</p>
      </div>
    )
  }
)
Alert.displayName = 'Alert'

export { Alert, alertVariants }
