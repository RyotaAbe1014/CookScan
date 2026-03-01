import { NextRequest, NextResponse } from "next/server";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { getSQSClient } from "@/lib/aws";
import { checkUserProfile } from "@/features/auth/auth-utils";

const AWS_SQS_QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;

export async function POST(request: NextRequest) {
  try {
    const { hasAuth, hasProfile, profile } = await checkUserProfile();
    if (!hasAuth || !hasProfile || !profile) {
      return NextResponse.json(
        { success: false, error: "認証が必要です" },
        { status: 401 },
      );
    }

    if (!AWS_SQS_QUEUE_URL) {
      throw new Error("環境変数 AWS_SQS_QUEUE_URL が設定されていません");
    }

    const body = await request.json();
    const { jobId } = body;

    if (typeof jobId !== "string" || !jobId) {
      return NextResponse.json(
        { success: false, error: "jobId は必須です" },
        { status: 400 },
      );
    }

    const userId = profile.id;
    const s3Prefix = `uploads/${userId}/${jobId}/`;

    const sqsClient = getSQSClient();
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: AWS_SQS_QUEUE_URL,
        MessageBody: JSON.stringify({ jobId, userId, s3Prefix }),
      }),
    );

    return NextResponse.json(
      { success: true, result: { jobId } },
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
