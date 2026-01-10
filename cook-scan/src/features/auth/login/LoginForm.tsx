'use client'

import { useTransition } from 'react'
import { login } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import {
  BookIcon,
  MailIcon,
  LockIcon,
  LoginIcon,
  UserAddIcon,
} from '@/components/icons'

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition()

  const handleLogin = async (formData: FormData) => {
    startTransition(async () => {
      await login(formData)
    })
  }

  return (
    <>
      {/* Card with glassmorphism effect */}
      <div className="overflow-hidden rounded-2xl bg-white/80 shadow-2xl backdrop-blur-xl ring-1 ring-gray-900/5">
        <div className="px-8 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
          {/* Header with icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg">
              <BookIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              CookScan
            </h2>
            <p className="mt-3 text-base text-gray-600">
              レシピをスキャンして
              <br />
              <span className="font-medium text-indigo-600">あなただけの料理コレクション</span>
              を作りましょう
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-5">
              {/* Email input */}
              <FormField
                label="メールアドレス"
                htmlFor="email"
                required
                icon={<MailIcon className="h-4 w-4" />}
                iconColorClass="text-gray-400"
              >
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isPending}
                  variant="default"
                  size="lg"
                  placeholder="you@example.com"
                />
              </FormField>

              {/* Password input */}
              <FormField
                label="パスワード"
                htmlFor="password"
                required
                icon={<LockIcon className="h-4 w-4" />}
                iconColorClass="text-gray-400"
              >
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isPending}
                  variant="default"
                  size="lg"
                  placeholder="••••••••"
                />
              </FormField>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
              {/* Login button */}
              <Button
                formAction={handleLogin}
                disabled={isPending}
                isLoading={isPending}
                variant="primary"
                className="w-full"
              >
                {isPending ? (
                  'ログイン中...'
                ) : (
                  <>
                    <LoginIcon className="h-4 w-4" />
                    ログイン
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white/80 px-3 text-gray-500">または</span>
                </div>
              </div>

              {/* Signup button */}
              <Button
                disabled={true}
                isLoading={isPending}
                variant="secondary"
                className="w-full hover:border-indigo-300 hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700"
              >
                {isPending ? (
                  '登録中...'
                ) : (
                  <>
                    <UserAddIcon className="h-4 w-4" />
                    新規登録
                  </>
                )}
              </Button>
            </div>
          </form>
        </div >

        {/* Footer decoration */}
        < div className="bg-linear-to-r from-indigo-500 to-purple-600 px-8 py-4 sm:px-10" >
          <p className="text-center text-xs text-white/80">
            安全に保存されるあなたのレシピコレクション
          </p>
        </div >
      </div >

      {/* Additional info */}
      < p className="mt-6 text-center text-sm text-gray-600" >
        AIがレシピを自動抽出
        < span className="mx-1" >•</span >
        簡単に整理・検索
      </p >
    </>
  )
}
