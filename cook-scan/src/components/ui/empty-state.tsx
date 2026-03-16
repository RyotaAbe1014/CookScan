import { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="shadow-card rounded-xl bg-white p-12 text-center ring-1 ring-gray-900/5">
      <div className="bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-150 hover:scale-105">
        {icon}
      </div>
      <h3 className="text-foreground mt-6 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
