'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon } from '@/components/icons/home-icon'
import { BookIcon } from '@/components/icons/book-icon'
import { TagIcon } from '@/components/icons/tag-icon'
import { UserIcon } from '@/components/icons/user-icon'
import { LogoutIcon } from '@/components/icons/logout-icon'
import { SpinnerIcon } from '@/components/icons/spinner-icon'

interface MobileNavProps {
  onUiLinkClick: () => void
  onLogoutClick?: () => void
  isLoggingOut?: boolean
}

export function MobileNav({ onUiLinkClick, onLogoutClick, isLoggingOut }: MobileNavProps) {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'ダッシュボード', icon: HomeIcon },
    { href: '/recipes', label: 'レシピ', icon: BookIcon },
    { href: '/tags', label: 'タグ', icon: TagIcon },
    { href: '/profile', label: 'プロフィール', icon: UserIcon },
  ]

  return (
    <div className="flex h-full flex-col justify-between p-6">
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onUiLinkClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}
              />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {onLogoutClick && (
        <button
          onClick={onLogoutClick}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? (
            <>
              <SpinnerIcon className="h-5 w-5 animate-spin" />
              ログアウト中...
            </>
          ) : (
            <>
              <LogoutIcon className="h-5 w-5" />
              Log out
            </>
          )}
        </button>
      )}
    </div>
  )
}
