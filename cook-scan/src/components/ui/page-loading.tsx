import { SpinnerIcon } from '@/components/icons'

export function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="flex flex-col items-center gap-4">
        <SpinnerIcon className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">読み込み中...</p>
      </div>
    </div>
  )
}
