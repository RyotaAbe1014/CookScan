import { NextResponse } from "next/server";
import * as S3 from "@aws-sdk/client-s3";

export async function GET() {
  const AWS_REGION = "ap-northeast-1";
  const S3_BUCKET_NAME = "cookscan-s3-bucket";

  const isVercel = process.env.VERCEL === "1";

  let credentials: S3.S3ClientConfig["credentials"] | undefined;
  if (isVercel) {
    const { awsCredentialsProvider } = await import(
      "@vercel/oidc-aws-credentials-provider"
    );
    credentials = awsCredentialsProvider({
      roleArn: process.env.AWS_ROLE_ARN!,
    });
  }
  // ローカルでは credentials を指定しない → aws configure の設定が使われる

  const s3client = new S3.S3Client({
    region: AWS_REGION,
    ...(credentials && { credentials }),
  });

  try {
    const result = await s3client.send(
      new S3.ListObjectsV2Command({
        Bucket: S3_BUCKET_NAME,
      }),
    );
    return NextResponse.json({
      status: "ok",
      objectCount: result.KeyCount ?? 0,
    });
  } catch (error) {
    console.error("S3 access failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
