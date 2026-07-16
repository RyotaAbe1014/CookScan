import { NextRequest, NextResponse } from "next/server";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { getSQSClient } from "@/lib/aws/sqs";
import { checkUserProfile } from "@/features/auth/auth-utils";
import { z } from "zod";

const AWS_SQS_QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;

// presign ルートで randomUUID() により発行された値のみ受け付ける。
// S3 プレフィックスに連結するため、パス断片などの混入をここで遮断する。
const jobIdSchema = z.string().uuid();

export async function POST(request: NextRequest) {
  try {
    const { hasAuth, hasProfile, profile } = await checkUserProfile();
    if (!hasAuth || !hasProfile || !profile) {
      return NextResponse.json({ success: false, error: "認証が必要です" }, { status: 401 });
    }

    if (!AWS_SQS_QUEUE_URL) {
      throw new Error("環境変数 AWS_SQS_QUEUE_URL が設定されていません");
    }

    const body = await request.json();
    const parsedJobId = jobIdSchema.safeParse(body.jobId);

    if (!parsedJobId.success) {
      return NextResponse.json({ success: false, error: "jobId が不正です" }, { status: 400 });
    }
    const jobId = parsedJobId.data;

    const userId = profile.id;
    const s3Prefix = `uploads/${userId}/${jobId}/`;

    const sqsClient = getSQSClient();
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: AWS_SQS_QUEUE_URL,
        MessageBody: JSON.stringify({ jobId, userId, s3Prefix }),
      }),
    );

    return NextResponse.json({ success: true, result: { jobId } }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 },
    );
  }
}
