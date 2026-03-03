import { NextRequest, NextResponse } from "next/server";
import * as S3 from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "@/lib/aws";
import { checkUserProfile } from "@/features/auth/auth-utils";
import { randomUUID } from "crypto";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const MAX_FILES = 5;

export async function POST(request: NextRequest) {
  try {
    const { hasAuth, hasProfile, profile } = await checkUserProfile();
    if (!hasAuth || !hasProfile || !profile) {
      return NextResponse.json(
        { success: false, error: "認証が必要です" },
        { status: 401 },
      );
    }

    if (!S3_BUCKET_NAME) {
      throw new Error("環境変数 S3_BUCKET_NAME が設定されていません");
    }

    const body = await request.json();
    const fileCount = body.fileCount;

    if (typeof fileCount !== "number" || fileCount < 1 || fileCount > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `fileCountは1〜${MAX_FILES}の範囲で指定してください` },
        { status: 400 },
      );
    }

    const jobId = randomUUID();
    const s3client = getS3Client();

    const files = await Promise.all(
      Array.from({ length: fileCount }, async (_, i) => {
        const key = `uploads/${profile.id}/${jobId}/${i}`;
        const command = new S3.PutObjectCommand({
          Bucket: S3_BUCKET_NAME,
          Key: key,
        });
        const presignedUrl = await getSignedUrl(s3client, command, {
          expiresIn: 3600,
        });
        return { key, presignedUrl };
      }),
    );

    return NextResponse.json(
      { success: true, result: { jobId, files } },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 },
    );
  }
}
