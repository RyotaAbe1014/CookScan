import { mastra } from '@/mastra'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // JSON からテキストを取得
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'textは必須です' },
        { status: 400 }
      )
    }

    const workflow = mastra.getWorkflow('textToRecipeWorkflow')

    const run = await workflow.createRunAsync()
    const response = await run.start({
      inputData: {
        text
      }
    })

    if (response.status === 'failed' || response.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'Failed to process request' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, result: response.result }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
