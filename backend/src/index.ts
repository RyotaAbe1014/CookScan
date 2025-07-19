import 'dotenv/config'
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { mastra } from '../mastra/src/mastra'

const app = new Hono()

// CORS設定
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// ヘルスチェックエンドポイント
app.get('/api/health', (c) => {
  c.header('Content-Type', 'application/json; charset=utf-8')
  return c.json({
    status: 'ok',
    message: 'Backend is running!',
    timestamp: new Date().toISOString()
  })
})

// レシピ抽出エンドポイント
app.post('/api/recipes/extract', async (c) => {
  try {

    // リクエストボディからフォームデータを取得
    const formData = await c.req.formData()
    const imageFile = formData.get('image')

    // ファイルバリデーション
    if (!imageFile || !(imageFile instanceof File)) {
      return c.json({ error: '画像ファイルが必要です' }, 400)
    }
    // ファイルサイズチェック（10MB制限）
    if (imageFile.size > 10 * 1024 * 1024) {
      return c.json({ error: 'ファイルサイズは10MB以下にしてください' }, 400)
    }

    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(imageFile.type)) {
      return c.json({ error: 'JPEG、PNG、またはWEBP形式の画像のみ対応しています' }, 400)
    }

    // Mastraワークフローの実行
    const workflow = mastra.getWorkflow('cookScanWorkflow')

    const run = await workflow.createRunAsync()
    const response = await run.start({
      inputData: {
        image: imageFile
      }
    })

    console.log('Workflow completed successfully')

    if (response.status === 'failed' || response.status === 'suspended') {
      return c.json({ error: 'レシピの抽出中にエラーが発生しました' }, 500)
    }

    // レスポンスを返す
    c.header('Content-Type', 'application/json; charset=utf-8')
    return c.json({
      success: true,
      recipe: response.result
    })

  } catch (error) {
    console.error('Recipe extraction error:', error)
    c.header('Content-Type', 'application/json; charset=utf-8')
    return c.json({
      error: 'レシピの抽出中にエラーが発生しました',
      details: error instanceof Error ? error.message : '不明なエラー'
    }, 500)
  }
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
