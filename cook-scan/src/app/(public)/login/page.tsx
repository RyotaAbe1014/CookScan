'use client'

import { useTransition } from 'react'
import { login, signup } from '@/features/auth/actions'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()

  const handleLogin = async (formData: FormData) => {
    startTransition(async () => {
      await login(formData)
    })
  }

  const handleSignup = async (formData: FormData) => {
    startTransition(async () => {
      await signup(formData)
    })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 -top-4 h-72 w-72 animate-pulse rounded-full bg-linear-to-br from-indigo-200 to-purple-200 opacity-30 blur-3xl" />
        <div className="absolute -bottom-8 -right-8 h-96 w-96 animate-pulse rounded-full bg-linear-to-br from-purple-200 to-pink-200 opacity-30 blur-3xl animation-delay-2000" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-linear-to-br from-blue-200 to-indigo-200 opacity-20 blur-3xl animation-delay-4000" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card with glassmorphism effect */}
        <div className="overflow-hidden rounded-2xl bg-white/80 shadow-2xl backdrop-blur-xl ring-1 ring-gray-900/5">
          <div className="px-8 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
            {/* Header with icon */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
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
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    メールアドレス
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={isPending}
                      className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    パスワード
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      disabled={isPending}
                      className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
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
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
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
                  formAction={handleSignup}
                  disabled={isPending}
                  isLoading={isPending}
                  variant="secondary"
                  className="w-full hover:border-indigo-300 hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700"
                >
                  {isPending ? (
                    '登録中...'
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      新規登録
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Footer decoration */}
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 px-8 py-4 sm:px-10">
            <p className="text-center text-xs text-white/80">
              安全に保存されるあなたのレシピコレクション
            </p>
          </div>
        </div>

        {/* Additional info */}
        <p className="mt-6 text-center text-sm text-gray-600">
          AIがレシピを自動抽出
          <span className="mx-1">•</span>
          簡単に整理・検索
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
