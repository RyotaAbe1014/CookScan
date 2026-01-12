import { type HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/tailwind'
import {
  XCircleIcon,
  CheckCircleIcon,
  WarningIcon,
  InfoSolidIcon,
} from '@/components/icons'

const alertVariants = cva(
  // 共通スタイル - デザインシステムに準拠
  'flex items-start gap-3 rounded-lg p-4 ring-1 transition-colors duration-150',
  {
    variants: {
      variant: {
        // エラー: red系
        error: 'bg-danger-light ring-danger-light',
        // 成功: green系
        success: 'bg-success-light ring-success-light',
        // 警告: amber系
        warning: 'bg-warning-light ring-warning-light',
        // 情報: blue系
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
      error: 'text-danger',
      success: 'text-success',
      warning: 'text-warning',
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
      error: 'text-danger-hover',
      success: 'text-green-800',
      warning: 'text-amber-800',
      info: 'text-blue-800',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

// SVG アイコンコンポーネント
const AlertIcons = {
  error: <XCircleIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningIcon />,
  info: <InfoSolidIcon />,
}

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
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
