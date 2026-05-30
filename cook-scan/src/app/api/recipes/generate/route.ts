import { openaiGpt } from "@/backend/ai/models/openai";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const USER_ROLE = "user";
const ASSISTANT_ROLE = "assistant";
const MESSAGE_ROLES = [USER_ROLE, ASSISTANT_ROLE] as const;
const MAX_SUGGESTION_COUNT = 4;

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(MESSAGE_ROLES),
        content: z.string().trim().min(1),
      }),
    )
    .min(1, "messagesは1件以上必要です")
    .refine((messages) => messages[messages.length - 1]?.role === USER_ROLE, {
      message: "最後のメッセージはuserである必要があります",
    }),
});

const recipeDraftSchema = z.object({
  title: z.string().min(1),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1),
        unit: z.string().min(1),
        notes: z.string().nullable(),
      }),
    )
    .min(1),
  steps: z
    .array(
      z.object({
        instruction: z.string().min(1),
        timerSeconds: z.number().nullable(),
      }),
    )
    .min(1),
  memo: z.string().nullable(),
});

const responseSchema = z.object({
  message: z.string(),
  intent: z.enum(["chat", "recipe_draft"]),
  recipeDraft: recipeDraftSchema.nullable(),
  suggestions: z.array(z.string().min(1)).min(1).max(MAX_SUGGESTION_COUNT),
});

const systemPrompt = `
あなたはレシピ作成に強いAIレシピアシスタントです。
必ず日本語で回答してください。
ユーザーの手持ち食材、希望、制約をもとに、実際に作りやすいレシピを1つ提案してください。
会話履歴がある場合は、直前までの提案内容を踏まえて調整してください。

出力は指定された構造だけにしてください。

フィールドの方針:
- message: チャット吹き出しに表示する短い自然な返答
- intent: レシピ下書きを作る場合は "recipe_draft"、質問への返答だけなら "chat"
- recipeDraft: intent が "recipe_draft" の場合だけレシピ下書きを入れる。intent が "chat" の場合は null
- suggestions: 次にユーザーが押せる短い提案を1〜4件。会話内容や作成したレシピに合わせて毎回変える

方針:
- ユーザーがレシピ作成、献立提案、材料から料理を作る相談、既存提案の調整を求めたら recipe_draft にする
- 手持ち食材をできるだけ優先する
- 不足食材や補足は recipeDraft.memo に含める
- 材料の分量が不明な場合は unit に「適量」と書く
- 作り方は初心者でも分かる粒度にする
- 危険な調理や衛生的に問題のある提案はしない
`;

function buildConversationPrompt(
  messages: Array<{
    role: (typeof MESSAGE_ROLES)[number];
    content: string;
  }>,
) {
  // User/assistant labels and separators preserve turn order for follow-up recipe adjustments.
  return messages
    .map((message) => {
      const speaker = message.role === USER_ROLE ? "ユーザー" : "アシスタント";
      return `${speaker}:\n${message.content}`;
    })
    .join("\n\n---\n\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = requestSchema.parse(await request.json());

    const { object } = await generateObject({
      model: openaiGpt,
      schema: responseSchema,
      system: systemPrompt,
      prompt: buildConversationPrompt(body.messages),
      // gpt-5-mini is a reasoning model: temperature is unsupported (only the default is allowed).
    });

    return NextResponse.json(
      {
        status: "success",
        result: object,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: "error", error: error.issues[0]?.message ?? "入力内容が不正です" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { status: "error", error: "レシピ生成に失敗しました" },
      { status: 500 },
    );
  }
}
