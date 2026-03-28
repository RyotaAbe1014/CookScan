import { NextRequest, NextResponse } from "next/server";
import { createUIMessageStreamResponse } from 'ai';
import { handleChatStream } from '@mastra/ai-sdk';
import z from 'zod';
import { mastra } from "@/backend/mastra";
import { checkUserProfile } from "@/features/auth/auth-utils";
import * as RecipeDevelopmentService from "@/backend/services/recipes/recipe-development-session.service"

// チャット開始
export async function POST(request: NextRequest) {
  const { hasAuth, hasProfile, profile } = await checkUserProfile();
  if (!hasAuth || !hasProfile || !profile) {
    return NextResponse.json(
      { success: false, error: "認証が必要です" },
      { status: 401 },
    );
  }

  const body = await request.json();
  // TODO: 後からafterでやってもいいかも
  // https://nextjs.org/docs/app/api-reference/functions/after
  const titleResponse = await mastra.getAgent("generateChatTitleAgent").generate(body.messages, {
    structuredOutput: {
      schema: z.object({
        title: z.string(),
      }),
    }
  })
  console.log("titleResponse", titleResponse.object.title)
  const title = titleResponse.object.title
  const threadId = crypto.randomUUID()
  await RecipeDevelopmentService.createRecipeDevelopmentSession(profile.id, threadId, title)

  const stream = await handleChatStream({
    mastra,
    agentId: "recipeDevelopmentAgent",
    params: {
      ...body,
      memory: {
        ...body.memory,
        thread: threadId,
        resource: profile.id,
      }
    },
  });
  return createUIMessageStreamResponse({ stream: stream });
  // 7. 失敗時は保存したセッションを削除 or エラー状態にする
}

// チャット一覧
export async function GET(_request: NextRequest) {
  const { hasAuth, hasProfile, profile } = await checkUserProfile();
  if (!hasAuth || !hasProfile || !profile) {
    return NextResponse.json(
      { success: false, error: "認証が必要です" },
      { status: 401 },
    );
  }

  const sessionList = await RecipeDevelopmentService.getRecipeDevelopmentSessionList(profile.id)

  return NextResponse.json({ success: true, result: sessionList }, { status: 200 })
}
