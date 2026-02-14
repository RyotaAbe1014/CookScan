import { mastra } from '@/backend/mastra'
import { NextRequest, NextResponse } from 'next/server'

const MAX_FILES = 5

export async function POST(request: NextRequest) {
  try {
    // multipart/form-data からファイルを取得
    const formData = await request.formData()
    const files = formData.getAll('file')

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'files が見つかりません。multipart/form-data で file を送信してください。' },
        { status: 400 }
      )
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `アップロードできる画像は最大${MAX_FILES}枚です。` },
        { status: 400 }
      )
    }

    const workflow = mastra.getWorkflow('cookScanWorkflow')

    const run = await workflow.createRun()
    const response = await run.start({
      inputData: {
        images: files.map((file) => file as File)
      }
    })

    if (response.status === 'failed' || response.status === 'suspended' || response.status === 'tripwire') {
      return NextResponse.json(
        { success: false, error: 'Failed to process request' },
        { status: 500 }
      )
    }
    if (response.status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'Unexpected workflow status' },
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
