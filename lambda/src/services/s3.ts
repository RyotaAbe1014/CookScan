import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import type { OcrResult } from '../types/index.js';

const s3 = new S3Client();
const BUCKET = process.env.S3_BUCKET_NAME!;

export async function listImageKeys(s3Prefix: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: s3Prefix,
  });
  const response = await s3.send(command);
  if (!response.Contents) return [];

  return response.Contents.filter((obj) => obj.Key)
    .map((obj) => obj.Key!);
}

export async function getImageBuffer(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  const response = await s3.send(command);
  const bytes = await response.Body!.transformToByteArray();
  return Buffer.from(bytes);
}

export async function saveOcrResult(
  userId: string,
  jobId: string,
  result: OcrResult,
): Promise<void> {
  const key = `results/${userId}/${jobId}/ocr-result.json`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(result),
    ContentType: 'application/json',
  });
  await s3.send(command);
}
