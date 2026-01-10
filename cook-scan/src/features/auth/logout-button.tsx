'use client'

import { useTransition } from 'react'
import { logout } from './actions'
import { Button } from '@/components/ui/button'
import { LogoutIcon, SpinnerIcon } from '@/components/icons'

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <Button
      variant="secondary"
      size="md"
      onClick={handleLogout}
      disabled={isPending}
      className="hover:border-red-300 hover:bg-red-50 hover:text-red-700"
      aria-label="ログアウト"
    >
      {isPending ? (
        <>
          <SpinnerIcon className="h-4 w-4 animate-spin text-gray-500" />
          <span className="hidden sm:inline">ログアウト中...</span>
        </>
      ) : (
        <>
          <LogoutIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          <span className="hidden sm:inline">ログアウト</span>
        </>
      )}
    </Button>
  )
}
