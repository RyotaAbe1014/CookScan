'use client'

import { useMemo, useState, useTransition } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PageContainer } from '@/components/layouts/page-container'
import { BeakerIcon } from '@/components/icons/beaker-icon'
import { ReloadIcon } from '@/components/icons/reload-icon'
import { CheckCircleIcon } from '@/components/icons/check-circle-icon'

const SAMPLE_PROMPT = '鶏もも肉とキャベツを使って、2人分の平日向け夕食レシピを一緒に考えたいです。20分くらいで作れる方向で相談したいです。'

type RecipeDevelopmentSessionListItem = {
  id: string
  userId: string
  threadId: string
  title: string
  createdAt: string
  updatedAt: string
}

type RecipeDevelopmentSessionListResponse = {
  success: boolean
  result?: RecipeDevelopmentSessionListItem[]
  error?: string
}

type ChatDetailResponse = {
  success: boolean
  result?: unknown[]
  error?: string
}

function getMessageText(message: UIMessage) {
  return message.parts
    .map((part) => {
      if (part.type === 'text') {
        return part.text
      }

      if (part.type === 'reasoning') {
        return part.text
      }

      return ''
    })
    .filter(Boolean)
    .join('\n')
}

function buildRequestPreview(prompt: string) {
  return {
    messages: [
      {
        role: 'user',
        parts: [
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  }
}

export function PlaygroundClient() {
  const [endpoint, setEndpoint] = useState('/api/recipes/generate/chats')
  const [prompt, setPrompt] = useState(SAMPLE_PROMPT)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [listStatusCode, setListStatusCode] = useState<number | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<RecipeDevelopmentSessionListItem[]>([])
  const [isListPending, startListTransition] = useTransition()
  const [detailSessionId, setDetailSessionId] = useState<string | null>(null)
  const [detailStatusCode, setDetailStatusCode] = useState<number | null>(null)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [detailMessages, setDetailMessages] = useState<unknown[]>([])
  const [isDetailPending, startDetailTransition] = useTransition()
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null)
  const [isDeletePending, startDeleteTransition] = useTransition()

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: endpoint,
      fetch: async (input, init) => {
        setRequestError(null)

        const response = await fetch(input, init)

        setStatusCode(response.status)
        setSessionId(response.headers.get('x-chat-session-id'))
        setThreadId(response.headers.get('x-chat-thread-id'))

        return response
      },
    })
  }, [endpoint])

  const {
    messages,
    sendMessage,
    setMessages,
    stop,
    status,
    error,
    clearError,
  } = useChat({
    transport,
    onError: (chatError) => {
      setRequestError(chatError.message)
    },
  })

  const handleRun = async () => {
    if (!prompt.trim()) {
      setRequestError('最初のユーザーメッセージを入力してください')
      return
    }

    clearError()
    setRequestError(null)
    setStatusCode(null)
    setSessionId(null)
    setThreadId(null)
    setMessages([])

    await sendMessage({
      text: prompt,
    })
  }

  const handleReset = () => {
    stop()
    clearError()
    setRequestError(null)
    setStatusCode(null)
    setSessionId(null)
    setThreadId(null)
    setPrompt(SAMPLE_PROMPT)
    setMessages([])
  }

  const handleFetchChatList = () => {
    startListTransition(async () => {
      setListError(null)

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
        })
        const data = await response.json() as RecipeDevelopmentSessionListResponse

        setListStatusCode(response.status)

        if (!response.ok || !data.success) {
          setSessions([])
          setListError(data.error ?? 'チャット一覧の取得に失敗しました')
          return
        }

        setSessions(data.result ?? [])
      } catch {
        setSessions([])
        setListStatusCode(null)
        setListError('チャット一覧の取得中に予期しないエラーが発生しました')
      }
    })
  }

  const handleFetchChatDetail = (targetSessionId: string) => {
    startDetailTransition(async () => {
      setDetailError(null)
      setDetailSessionId(targetSessionId)

      try {
        const response = await fetch(`${endpoint}/${targetSessionId}`, {
          method: 'GET',
        })
        const data = await response.json() as ChatDetailResponse

        setDetailStatusCode(response.status)

        if (!response.ok || !data.success) {
          setDetailMessages([])
          setDetailError(data.error ?? 'チャット詳細の取得に失敗しました')
          return
        }

        setDetailMessages(data.result ?? [])
      } catch {
        setDetailMessages([])
        setDetailStatusCode(null)
        setDetailError('チャット詳細の取得中に予期しないエラーが発生しました')
      }
    })
  }

  const handleDeleteChat = (targetSessionId: string) => {
    startDeleteTransition(async () => {
      setDeletingSessionId(targetSessionId)

      try {
        const response = await fetch(`${endpoint}/${targetSessionId}`, {
          method: 'DELETE',
        })
        const data = await response.json() as { success: boolean; error?: string }

        if (!response.ok || !data.success) {
          setListError(data.error ?? 'チャットの削除に失敗しました')
          return
        }

        setSessions((prev) => prev.filter((s) => s.id !== targetSessionId))

        if (detailSessionId === targetSessionId) {
          setDetailSessionId(null)
          setDetailStatusCode(null)
          setDetailMessages([])
        }
      } catch {
        setListError('チャットの削除中に予期しないエラーが発生しました')
      } finally {
        setDeletingSessionId(null)
      }
    })
  }

  const requestPreview = buildRequestPreview(prompt)
  const responsePreview = messages.map((message) => ({
    id: message.id,
    role: message.role,
    text: getMessageText(message),
  }))

  return (
    <PageContainer className="space-y-6">
      <section className="rounded-2xl bg-linear-to-br from-primary-light via-white to-secondary-light p-6 shadow-card ring-1 ring-gray-900/5 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-primary">
            <BeakerIcon className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              API Playground
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              `generate/chats` エンドポイント向けの検証ページです。`useChat` でメッセージ送信と
              ストリーム受信を行い、整形後の会話内容を確認できます。
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Chat List"
              icon={<ReloadIcon className="h-5 w-5 text-white" />}
              iconColor="secondary"
            />
            <CardContent className="space-y-5" padding="lg">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-section-header px-4 py-3 ring-1 ring-section-header-border">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    GET
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {endpoint}
                  </p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-border">
                  {listStatusCode ?? '未実行'}
                </div>
              </div>

              {listError && (
                <Alert variant="error">{listError}</Alert>
              )}

              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border-dark bg-white p-6 text-sm text-muted-foreground">
                    まだ一覧は取得していません。
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-2xl border border-border bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {session.title}
                          </p>
                          <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                            thread: {session.threadId}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleFetchChatDetail(session.id)}
                            isLoading={isDetailPending && detailSessionId === session.id}
                          >
                            詳細取得
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDeleteChat(session.id)}
                            isLoading={isDeletePending && deletingSessionId === session.id}
                          >
                            削除
                          </Button>
                          <div className="rounded-full bg-section-header px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-section-header-border">
                            {new Date(session.updatedAt).toLocaleString('ja-JP')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="rounded-2xl bg-slate-950 p-4 text-slate-100 shadow-inner">
                <pre className="min-h-40 overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6">
                  {JSON.stringify(sessions, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  size="lg"
                  onClick={handleFetchChatList}
                  isLoading={isListPending}
                >
                  チャット一覧を取得
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Chat Detail"
              icon={<CheckCircleIcon className="h-5 w-5 text-white" />}
              iconColor="secondary"
            />
            <CardContent className="space-y-5" padding="lg">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-section-header px-4 py-3 ring-1 ring-section-header-border">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    GET
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {detailSessionId ? `${endpoint}/${detailSessionId}` : `${endpoint}/[id]`}
                  </p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-border">
                  {detailStatusCode ?? '未実行'}
                </div>
              </div>

              {detailError && (
                <Alert variant="error">{detailError}</Alert>
              )}

              <div className="rounded-2xl bg-slate-950 p-4 text-slate-100 shadow-inner">
                <pre className="min-h-40 overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6">
                  {detailMessages.length > 0
                    ? JSON.stringify(detailMessages, null, 2)
                    : 'チャット一覧から「詳細取得」を押してください。'}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Request"
              icon={<ReloadIcon className="h-5 w-5 text-white" />}
              iconColor="primary"
            />
            <CardContent className="space-y-5" padding="lg">
              <div>
                <label
                  htmlFor="playground-endpoint"
                  className="block text-sm font-semibold text-foreground"
                >
                  Endpoint
                </label>
                <Input
                  id="playground-endpoint"
                  value={endpoint}
                  onChange={(event) => setEndpoint(event.target.value)}
                  placeholder="/api/recipes/generate/chats"
                  className="mt-2 font-mono"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="playground-prompt"
                    className="block text-sm font-semibold text-foreground"
                  >
                    First Message
                  </label>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setPrompt(SAMPLE_PROMPT)}
                    disabled={status === 'submitted' || status === 'streaming'}
                  >
                    サンプルを入れる
                  </Button>
                </div>
                <Textarea
                  id="playground-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={8}
                  placeholder="最初のユーザーメッセージを入力してください"
                  className="text-sm"
                />
              </div>

              <div>
                <p className="block text-sm font-semibold text-foreground">
                  Request Body Preview
                </p>
                <div className="mt-2 rounded-2xl bg-slate-950 p-4 text-slate-100 shadow-inner">
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6">
                    {JSON.stringify(requestPreview, null, 2)}
                  </pre>
                </div>
              </div>

              {(requestError || error) && (
                <Alert variant="error">{requestError ?? error?.message}</Alert>
              )}

              <div className="flex justify-end gap-3">
                {(status === 'submitted' || status === 'streaming') && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={stop}
                  >
                    中断
                  </Button>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleReset}
                >
                  リセット
                </Button>
                <Button
                  type="button"
                  size="lg"
                  onClick={handleRun}
                  isLoading={status === 'submitted' || status === 'streaming'}
                >
                  API を実行
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Response"
            icon={<CheckCircleIcon className="h-5 w-5 text-white" />}
            iconColor="secondary"
          />
          <CardContent padding="lg" className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-section-header px-4 py-3 ring-1 ring-section-header-border">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Status
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {statusCode ? `${statusCode}` : status}
                </p>
              </div>
              <div className="rounded-xl bg-section-header px-4 py-3 ring-1 ring-section-header-border">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Hook
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {status}
                </p>
              </div>
              <div className="rounded-xl bg-section-header px-4 py-3 ring-1 ring-section-header-border">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Session
                </p>
                <p className="mt-1 truncate text-sm font-medium text-foreground">
                  {sessionId ?? '未取得'}
                </p>
              </div>
              <div className="rounded-xl bg-section-header px-4 py-3 ring-1 ring-section-header-border">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Thread
                </p>
                <p className="mt-1 truncate text-sm font-medium text-foreground">
                  {threadId ?? '未取得'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-dark bg-white p-6 text-sm text-muted-foreground">
                  ここに会話が表示されます。
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-2xl border border-border bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {message.role}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {getMessageText(message) || 'テキスト以外のパートを受信しました。'}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 text-slate-100 shadow-inner">
              <pre className="min-h-64 overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6">
                {JSON.stringify(responsePreview, null, 2)}
              </pre>
            </div>

            <Alert variant="info">
              `useChat` が受け取った整形済みメッセージを表示しています。現在の `generate/chats` ルートが未完成なら、実行時エラーになります。
            </Alert>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
