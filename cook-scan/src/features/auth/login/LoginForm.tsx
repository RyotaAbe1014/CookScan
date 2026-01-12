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
      {/* Card - フラットデザインを重視 */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
        <div className="px-8 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
          {/* Header with icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-600 shadow-md shadow-emerald-600/20 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/30">
              <BookIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              CookScan
            </h2>
            <p className="mt-3 text-base text-slate-600">
              レシピをスキャンして
              <br />
              <span className="font-semibold text-emerald-600">あなただけの料理コレクション</span>
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
                iconColorClass="text-emerald-500"
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
                iconColorClass="text-emerald-500"
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
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-slate-500">または</span>
                </div>
              </div>

              {/* Signup button */}
              <Button
                disabled={true}
                isLoading={isPending}
                variant="secondary"
                className="w-full hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
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
        <div className="bg-linear-to-r from-emerald-600 to-teal-500 px-8 py-4 sm:px-10">
          <p className="text-center text-xs font-medium text-white">
            安全に保存されるあなたのレシピコレクション
          </p>
        </div>
      </div>

      {/* Additional info */}
      <p className="mt-6 text-center text-sm text-slate-600">
        AIがレシピを自動抽出
        <span className="mx-1 text-emerald-500">•</span>
        簡単に整理・検索
      </p>
    </>
  )
}
