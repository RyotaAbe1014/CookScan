import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/aws";
import { checkUserProfile } from "@/features/auth/auth-utils";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

export async function GET(request: NextRequest) {
  try {
    const { hasAuth, hasProfile, profile } = await checkUserProfile();
    if (!hasAuth || !hasProfile || !profile) {
      return NextResponse.json(
        { success: false, error: "認証が必要です" },
        { status: 401 },
      );
    }

    const jobId = request.nextUrl.searchParams.get("jobId");
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "jobId は必須です" },
        { status: 400 },
      );
    }

    if (!S3_BUCKET_NAME) {
      throw new Error("環境変数 AWS_S3_BUCKET_NAME が設定されていません");
    }

    const userId = profile.id;
    const key = `results/${userId}/${jobId}/ocr-result.json`;

    const s3Client = getS3Client();
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    const body = await response.Body?.transformToString();
    if (!body) {
      return NextResponse.json({ success: "pending" }, { status: 202 });
    }
    const ocrResult = JSON.parse(body) as {
      status: string;
      jobId: string;
      processedAt: string;
      result: { text: string } | null;
      error: string | null;
    };

    if (ocrResult.status === "error" || ocrResult.error) {
      return NextResponse.json(
        { success: false, error: ocrResult.error ?? "OCR処理に失敗しました" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: true, result: { text: ocrResult.result?.text } },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name: string }).name === "NoSuchKey"
    ) {
      return NextResponse.json({ success: "pending" }, { status: 202 });
    }

    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch OCR result" },
      { status: 500 },
    );
  }
}
