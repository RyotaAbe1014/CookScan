import { SpinnerIcon } from "@/components/icons/spinner-icon";

export function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50">
      <div className="flex flex-col items-center gap-4">
        <SpinnerIcon className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">読み込み中...</p>
      </div>
    </div>
  );
}
