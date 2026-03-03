import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SQSEvent } from 'aws-lambda';

vi.mock('../src/services/s3.js', () => ({
  listImageKeys: vi.fn(),
  getImageBuffer: vi.fn(),
  saveOcrResult: vi.fn(),
}));

vi.mock('../src/services/ocr.js', () => ({
  extractTextFromImage: vi.fn(),
}));

import { handler } from '../src/handler.js';
import { listImageKeys, getImageBuffer, saveOcrResult } from '../src/services/s3.js';
import { extractTextFromImage } from '../src/services/ocr.js';

const mockListImageKeys = vi.mocked(listImageKeys);
const mockGetImageBuffer = vi.mocked(getImageBuffer);
const mockSaveOcrResult = vi.mocked(saveOcrResult);
const mockExtractText = vi.mocked(extractTextFromImage);

function createSQSEvent(records: { messageId: string; body: string }[]): SQSEvent {
  return {
    Records: records.map((r) => ({
      messageId: r.messageId,
      receiptHandle: 'handle',
      body: r.body,
      attributes: {} as never,
      messageAttributes: {},
      md5OfBody: '',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:us-east-1:123456789:queue',
      awsRegion: 'us-east-1',
    })),
  };
}

describe('handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常に画像をOCR処理して結果を保存する', async () => {
    mockListImageKeys.mockResolvedValue(['uploads/user1/job1/img1.jpg']);
    mockGetImageBuffer.mockResolvedValue(Buffer.from('fake-image'));
    mockExtractText.mockResolvedValue('抽出されたテキスト');
    mockSaveOcrResult.mockResolvedValue();

    const event = createSQSEvent([
      {
        messageId: 'msg1',
        body: JSON.stringify({ jobId: 'job1', userId: 'user1', s3Prefix: 'uploads/user1/job1/' }),
      },
    ]);

    const result = await handler(event);

    expect(result.batchItemFailures).toHaveLength(0);
    expect(mockSaveOcrResult).toHaveBeenCalledWith('user1', 'job1', {
      status: 'success',
      jobId: 'job1',
      processedAt: expect.any(String),
      result: { text: '抽出されたテキスト' },
      error: null,
    });
  });

  it('複数画像のOCR結果を結合する', async () => {
    mockListImageKeys.mockResolvedValue([
      'uploads/user1/job1/img1.jpg',
      'uploads/user1/job1/img2.png',
    ]);
    mockGetImageBuffer.mockResolvedValue(Buffer.from('fake'));
    mockExtractText
      .mockResolvedValueOnce('テキスト1')
      .mockResolvedValueOnce('テキスト2');
    mockSaveOcrResult.mockResolvedValue();

    const event = createSQSEvent([
      {
        messageId: 'msg1',
        body: JSON.stringify({ jobId: 'job1', userId: 'user1', s3Prefix: 'uploads/user1/job1/' }),
      },
    ]);

    await handler(event);

    expect(mockSaveOcrResult).toHaveBeenCalledWith('user1', 'job1', expect.objectContaining({
      result: { text: 'テキスト1\n\nテキスト2' },
    }));
  });

  it('画像が見つからない場合はエラー結果を保存し、batchItemFailuresに追加する', async () => {
    mockListImageKeys.mockResolvedValue([]);
    mockSaveOcrResult.mockResolvedValue();

    const event = createSQSEvent([
      {
        messageId: 'msg1',
        body: JSON.stringify({ jobId: 'job1', userId: 'user1', s3Prefix: 'uploads/user1/job1/' }),
      },
    ]);

    const result = await handler(event);

    expect(result.batchItemFailures).toEqual([{ itemIdentifier: 'msg1' }]);
    expect(mockSaveOcrResult).toHaveBeenCalledWith('user1', 'job1', expect.objectContaining({
      status: 'error',
      error: expect.stringContaining('No images found'),
    }));
  });

  it('部分的な失敗をサポートする', async () => {
    // 1つ目は成功、2つ目は失敗
    mockListImageKeys
      .mockResolvedValueOnce(['uploads/user1/job1/img.jpg'])
      .mockRejectedValueOnce(new Error('S3 error'));
    mockGetImageBuffer.mockResolvedValue(Buffer.from('fake'));
    mockExtractText.mockResolvedValue('テキスト');
    mockSaveOcrResult.mockResolvedValue();

    const event = createSQSEvent([
      {
        messageId: 'msg1',
        body: JSON.stringify({ jobId: 'job1', userId: 'user1', s3Prefix: 'uploads/user1/job1/' }),
      },
      {
        messageId: 'msg2',
        body: JSON.stringify({ jobId: 'job2', userId: 'user2', s3Prefix: 'uploads/user2/job2/' }),
      },
    ]);

    const result = await handler(event);

    expect(result.batchItemFailures).toEqual([{ itemIdentifier: 'msg2' }]);
  });
});
