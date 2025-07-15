import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'

const app = new Hono()

// CORS設定
app.use('/*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// ヘルスチェックエンドポイント
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  })
})

// Lambda用のハンドラー
export const handler = handle(app)

// ローカル開発サーバー
if (process.env.NODE_ENV !== 'production') {
  const port = 3001
  console.log(`Server is running on http://localhost:${port}`)
  serve({
    fetch: app.fetch,
    port
  })
}
