export interface SQSMessageBody {
  jobId: string;
  userId: string;
  s3Prefix: string;
}

export interface OcrResult {
  status: 'success' | 'error';
  jobId: string;
  processedAt: string;
  result: { text: string } | null;
  error: string | null;
}
