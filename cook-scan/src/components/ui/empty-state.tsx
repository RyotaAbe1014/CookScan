import { ReactNode } from 'react'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl bg-white p-12 text-center shadow-lg">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
