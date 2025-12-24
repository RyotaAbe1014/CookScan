'use client'

import { ErrorPageContent } from '@/features/errors/error-page-content'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorPageContent error={error} reset={reset} />
}