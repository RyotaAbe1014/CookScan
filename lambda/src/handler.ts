import type { SQSEvent, SQSBatchResponse } from 'aws-lambda';
import type { SQSMessageBody, OcrResult } from './types/index.js';
import { listImageKeys, getImageBuffer, saveOcrResult } from './services/s3.js';
import { extractTextFromImage } from './services/ocr.js';

async function processMessage(body: SQSMessageBody): Promise<void> {
  const { jobId, userId, s3Prefix } = body;

  try {
    const imageKeys = await listImageKeys(s3Prefix);
    if (imageKeys.length === 0) {
      throw new Error(`No images found under prefix: ${s3Prefix}`);
    }

    const texts = await Promise.all(
      imageKeys.map(async (key) => {
        const buffer = await getImageBuffer(key);
        return extractTextFromImage(buffer);
      })
    );

    const result: OcrResult = {
      status: 'success',
      jobId,
      processedAt: new Date().toISOString(),
      result: { text: texts.join('\n\n') },
      error: null,
    };
    await saveOcrResult(userId, jobId, result);
  } catch (err) {
    const errorResult: OcrResult = {
      status: 'error',
      jobId,
      processedAt: new Date().toISOString(),
      result: null,
      error: err instanceof Error ? err.message : String(err),
    };
    await saveOcrResult(userId, jobId, errorResult);
    throw err;
  }
}

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const batchItemFailures: SQSBatchResponse['batchItemFailures'] = [];

  for (const record of event.Records) {
    try {
      const body: SQSMessageBody = JSON.parse(record.body);
      await processMessage(body);
    } catch {
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
}
