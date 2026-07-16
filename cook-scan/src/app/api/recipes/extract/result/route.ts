import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/aws/s3";
import { checkUserProfile } from "@/features/auth/auth-utils";
import { z } from "zod";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

// presign ルートで randomUUID() により発行された値のみ受け付ける。
// S3 キーに連結するため、パス断片などの混入をここで遮断する。
const jobIdSchema = z.string().uuid();

export async function GET(request: NextRequest) {
  try {
    const { hasAuth, hasProfile, profile } = await checkUserProfile();
    if (!hasAuth || !hasProfile || !profile) {
      return NextResponse.json({ success: false, error: "認証が必要です" }, { status: 401 });
    }

    const parsedJobId = jobIdSchema.safeParse(request.nextUrl.searchParams.get("jobId"));
    if (!parsedJobId.success) {
      return NextResponse.json({ success: false, error: "jobId が不正です" }, { status: 400 });
    }
    const jobId = parsedJobId.data;

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
      return NextResponse.json({ status: "pending" }, { status: 202 });
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
        { status: "error", error: ocrResult.error ?? "OCR処理に失敗しました" },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { status: "success", result: { text: ocrResult.result?.text } },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name: string }).name === "NoSuchKey"
    ) {
      return NextResponse.json({ status: "pending" }, { status: 202 });
    }

    console.error(error);
    return NextResponse.json(
      { status: "error", error: "Failed to fetch OCR result" },
      { status: 500 },
    );
  }
}
