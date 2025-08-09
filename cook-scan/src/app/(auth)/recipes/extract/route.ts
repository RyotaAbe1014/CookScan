import { mastra } from '@/mastra'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // multipart/form-data からファイルを取得
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'file が見つかりません。multipart/form-data で file を送信してください。' },
        { status: 400 }
      )
    }
    const workflow = mastra.getWorkflow('cookScanWorkflow')

    const run = await workflow.createRunAsync()
    const response = await run.start({
      inputData: {
        image: file
      }
    })

    console.log('Workflow completed successfully')

    if (response.status === 'failed' || response.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'Failed to process request' },
        { status: 500 }
      )
    }
    console.log(response.result)
    return NextResponse.json({}, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}