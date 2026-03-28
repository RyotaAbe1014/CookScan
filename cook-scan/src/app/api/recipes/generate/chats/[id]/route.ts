import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/backend/mastra";
import { checkUserProfile } from "@/features/auth/auth-utils";
import * as RecipeDevelopmentService from "@/backend/services/recipes/recipe-development-session.service"
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui'

// 会話
export async function POST(request: NextRequest) {
}

// チャット詳細
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { hasAuth, hasProfile, profile } = await checkUserProfile();
  if (!hasAuth || !hasProfile || !profile) {
    return NextResponse.json(
      { success: false, error: "認証が必要です" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const session = await RecipeDevelopmentService.getRecipeDevelopmentSessionById(id);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "セッションが見つかりません" },
      { status: 404 },
    );
  }

  if (session.userId !== profile.id) {
    return NextResponse.json(
      { success: false, error: "アクセス権限がありません" },
      { status: 403 },
    );
  }

  const memory = await mastra.getAgent('recipeDevelopmentAgent').getMemory();
  if (!memory) {
    return NextResponse.json(
      { success: false, error: "メモリが利用できません" },
      { status: 500 },
    );
  }

  const response = await memory.recall({
    threadId: session.threadId,
    resourceId: profile.id,
  });

  const uiMessages = toAISdkV5Messages(response?.messages || []);

  return NextResponse.json({ success: true, result: uiMessages })
}

// チャット削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { hasAuth, hasProfile, profile } = await checkUserProfile();
  if (!hasAuth || !hasProfile || !profile) {
    return NextResponse.json(
      { success: false, error: "認証が必要です" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const session = await RecipeDevelopmentService.getRecipeDevelopmentSessionById(id);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "セッションが見つかりません" },
      { status: 404 },
    );
  }

  if (session.userId !== profile.id) {
    return NextResponse.json(
      { success: false, error: "アクセス権限がありません" },
      { status: 403 },
    );
  }

  // Mastraメモリのスレッド削除
  const memory = await mastra.getAgent('recipeDevelopmentAgent').getMemory();
  if (memory) {
    await memory.deleteThread(session.threadId);
  }

  // DBのセッションレコード削除
  await RecipeDevelopmentService.deleteRecipeDevelopmentSession(id);

  return NextResponse.json({ success: true });
}
