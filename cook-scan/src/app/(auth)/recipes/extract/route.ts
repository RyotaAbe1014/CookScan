import { mastra } from '@/mastra'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const file = new File([], 'image.png', { type: 'image/png' })
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
    return NextResponse.json({}, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}