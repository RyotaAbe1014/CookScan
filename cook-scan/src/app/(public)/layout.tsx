export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 -top-4 h-72 w-72 animate-pulse rounded-full bg-linear-to-br from-indigo-200 to-purple-200 opacity-30 blur-3xl" />
        <div className="absolute -bottom-8 -right-8 h-96 w-96 animate-pulse rounded-full bg-linear-to-br from-purple-200 to-pink-200 opacity-30 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-linear-to-br from-blue-200 to-indigo-200 opacity-20 blur-3xl" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
