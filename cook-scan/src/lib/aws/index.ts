export { getSQSClient } from "./sqs";

import * as S3 from "@aws-sdk/client-s3";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

const AWS_REGION = "ap-northeast-1";

let cachedClient: S3.S3Client | null = null;

export function getS3Client(): S3.S3Client {
  if (cachedClient) return cachedClient;

  const isLocal = process.env.NODE_ENV === "development";

  if (isLocal) {
    // ローカルの場合はaws configureで認証済み
    cachedClient = new S3.S3Client({ region: AWS_REGION });
    return cachedClient;
  }

  const awsArn = process.env.AWS_ROLE_ARN;
  if (!awsArn) {
    throw new Error("環境変数 AWS_ROLE_ARN が設定されていません");
  }

  cachedClient = new S3.S3Client({
    region: AWS_REGION,
    credentials: awsCredentialsProvider({ roleArn: awsArn }),
  });

  return cachedClient;
}
