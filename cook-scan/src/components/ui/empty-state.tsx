import { ReactNode } from 'react'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl bg-white p-12 text-center shadow-card ring-1 ring-gray-900/5">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted transition-transform duration-150 hover:scale-105">
        {icon}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
