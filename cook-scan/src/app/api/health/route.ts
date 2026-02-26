import { NextResponse } from "next/server";
import * as S3 from "@aws-sdk/client-s3";

export async function GET() {
  const AWS_REGION = "ap-northeast-1";
  const S3_BUCKET_NAME = "cookscan-s3-bucket";

  const useOidc = !!process.env.AWS_ROLE_ARN;

  const debug = {
    useOidc,
    hasRoleArn: !!process.env.AWS_ROLE_ARN,
    roleArnPrefix: process.env.AWS_ROLE_ARN?.substring(0, 20) ?? "not set",
    vercelEnv: process.env.VERCEL_ENV ?? "not set",
  };

  let credentials: S3.S3ClientConfig["credentials"] | undefined;
  if (useOidc) {
    try {
      const { getVercelOidcToken } = await import("@vercel/functions/oidc");
      const token = await getVercelOidcToken();
      console.log("OIDC token obtained, length:", token?.length);
    } catch (oidcError) {
      console.error("OIDC token fetch failed:", oidcError);
      return NextResponse.json(
        { status: "error", message: "OIDC token fetch failed", debug },
        { status: 500 },
      );
    }

    const { awsCredentialsProvider } = await import(
      "@vercel/oidc-aws-credentials-provider"
    );
    credentials = awsCredentialsProvider({
      roleArn: process.env.AWS_ROLE_ARN!,
    });
  }

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
      debug,
    });
  } catch (error) {
    console.error("S3 access failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        debug,
      },
      { status: 500 },
    );
  }
}
