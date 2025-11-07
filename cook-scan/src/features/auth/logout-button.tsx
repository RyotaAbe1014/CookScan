'use client'

import { useTransition } from 'react'
import { logout } from './actions'

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isPending ? 'ログアウト中...' : 'ログアウト'}
    </button>
  )
}
