import * as SQS from "@aws-sdk/client-sqs";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

const AWS_REGION = "ap-northeast-1";

let cachedClient: SQS.SQSClient | null = null;

export function getSQSClient(): SQS.SQSClient {
  if (cachedClient) return cachedClient;

  const isLocal = process.env.NODE_ENV === "development";

  if (isLocal) {
    cachedClient = new SQS.SQSClient({ region: AWS_REGION });
    return cachedClient;
  }

  const awsArn = process.env.AWS_ROLE_ARN;
  if (!awsArn) {
    throw new Error("環境変数 AWS_ROLE_ARN が設定されていません");
  }

  cachedClient = new SQS.SQSClient({
    region: AWS_REGION,
    credentials: awsCredentialsProvider({ roleArn: awsArn }),
  });

  return cachedClient;
}
