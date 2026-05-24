import { openaiGpt } from "@/backend/ai/models/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1),
      }),
    )
    .min(1, "messagesは1件以上必要です")
    .refine((messages) => messages[messages.length - 1]?.role === "user", {
      message: "最後のメッセージはuserである必要があります",
    }),
});

const systemPrompt = `
あなたは家庭料理に強いAIレシピアシスタントです。
必ず日本語で回答してください。
ユーザーの手持ち食材、希望、制約をもとに、実際に作りやすいレシピを1つ提案してください。
会話履歴がある場合は、直前までの提案内容を踏まえて調整してください。

出力はMarkdown調のプレーンテキストにしてください。
コードフェンスやJSONは出力しないでください。

必ず以下の要素を含めてください。
- 短い会話文
- レシピ名
- 材料
- 作り方
- 足りないもの
- アレンジ案

方針:
- 手持ち食材をできるだけ優先する
- 足りないものがない場合は「足りないもの: なし」と書く
- 作り方は初心者でも分かる粒度にする
- 危険な調理や衛生的に問題のある提案はしない
`;

function buildConversationPrompt(
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>,
) {
  return messages
    .map((message) => {
      const speaker = message.role === "user" ? "ユーザー" : "アシスタント";
      return `${speaker}:\n${message.content}`;
    })
    .join("\n\n---\n\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = requestSchema.parse(await request.json());

    const { text } = await generateText({
      model: openaiGpt,
      system: systemPrompt,
      prompt: buildConversationPrompt(body.messages),
      temperature: 0.7,
    });

    return NextResponse.json(
      {
        status: "success",
        result: {
          markdown: text.trim(),
        },
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
