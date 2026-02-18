import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/login/LoginForm'

export const metadata: Metadata = {
  title: 'ログイン | CookScan',
  description: 'CookScanにログインして、レシピの管理・検索を始めましょう',
}

export default function LoginPage() {
  return <LoginForm />
}
