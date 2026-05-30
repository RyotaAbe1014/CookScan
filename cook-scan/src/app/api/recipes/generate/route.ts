import { openaiGpt } from "@/backend/ai/models/openai";
import * as RecipeRepository from "@/backend/repositories/recipe.repository";
import type { RecipeDetailOutput } from "@/backend/domain/recipes";
import { checkUserProfile } from "@/features/auth/auth-utils";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const USER_ROLE = "user";
const ASSISTANT_ROLE = "assistant";
const MESSAGE_ROLES = [USER_ROLE, ASSISTANT_ROLE] as const;
const MAX_SUGGESTION_COUNT = 4;

// 参照レシピが見つからなかった場合に投げる識別用エラー。
class ReferenceRecipeNotFoundError extends Error {}

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
  referenceRecipeIds: z.array(z.string().uuid()).optional(),
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

参照レシピが渡された場合:
- 参照レシピはユーザーが持ち込んだ既存レシピです。これらを「素材」として、ユーザーの指示に沿って合成・アレンジした新しいレシピを提案してください
- ただし下書きを作るかどうかはユーザーの本文の意図に従ってください。参照レシピについての質問なら chat で答えるだけにします
- 参照元のレシピをそのまま複製するのではなく、指示に応じて発展・改変させてください
`;

// 参照レシピを合成・アレンジのプロンプト文脈に変換する。
// 含める情報は title + 材料 + 手順 + memo（レシピ下書きのテキスト化と同じ粒度）。
function formatReferenceRecipe(recipe: RecipeDetailOutput) {
  const ingredients = recipe.ingredients
    .map((ingredient) => {
      const unit = ingredient.unit ?? "適量";
      const notes = ingredient.notes ? ` (${ingredient.notes})` : "";
      return `- ${ingredient.name}: ${unit}${notes}`;
    })
    .join("\n");
  const steps = recipe.steps
    .map((step, index) => {
      const timer = step.timerSeconds ? ` (${step.timerSeconds}秒)` : "";
      return `${index + 1}. ${step.instruction}${timer}`;
    })
    .join("\n");

  return [
    `タイトル: ${recipe.title}`,
    "材料:",
    ingredients || "（なし）",
    "手順:",
    steps || "（なし）",
    `メモ: ${recipe.memo ?? "なし"}`,
  ].join("\n");
}

// 渡された参照レシピIDをユーザー本人のレシピとして解決する。
// 一つでも見つからなければ ReferenceRecipeNotFoundError を投げる（部分成功させない）。
async function resolveReferenceRecipes(
  recipeIds: string[],
  userId: string,
): Promise<RecipeDetailOutput[]> {
  const recipes = await Promise.all(
    recipeIds.map((recipeId) => RecipeRepository.findRecipeById(recipeId, userId)),
  );

  const resolved: RecipeDetailOutput[] = [];
  for (const recipe of recipes) {
    if (recipe === null) {
      throw new ReferenceRecipeNotFoundError();
    }
    resolved.push(recipe);
  }
  return resolved;
}

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

// 参照レシピを会話プロンプトの先頭に添えるブロックへ整形する。
function buildReferenceRecipesBlock(recipes: RecipeDetailOutput[]) {
  const blocks = recipes
    .map((recipe, index) => `参照レシピ${index + 1}:\n${formatReferenceRecipe(recipe)}`)
    .join("\n\n---\n\n");
  return `以下はユーザーが持ち込んだ参照レシピです。これらを素材として扱ってください。\n\n${blocks}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = requestSchema.parse(await request.json());

    const referenceRecipeIds = body.referenceRecipeIds ?? [];

    // 参照レシピを使う場合のみ認証とDB解決が必要。
    let referenceBlock: string | null = null;
    if (referenceRecipeIds.length > 0) {
      const { hasAuth, hasProfile, profile } = await checkUserProfile();
      if (!hasAuth || !hasProfile || !profile) {
        return NextResponse.json(
          { status: "error", error: "認証が必要です" },
          { status: 401 },
        );
      }

      const referenceRecipes = await resolveReferenceRecipes(referenceRecipeIds, profile.id);
      referenceBlock = buildReferenceRecipesBlock(referenceRecipes);
    }

    const conversationPrompt = buildConversationPrompt(body.messages);
    const prompt = referenceBlock
      ? `${referenceBlock}\n\n===\n\n${conversationPrompt}`
      : conversationPrompt;

    const { object } = await generateObject({
      model: openaiGpt,
      schema: responseSchema,
      system: systemPrompt,
      prompt,
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

    if (error instanceof ReferenceRecipeNotFoundError) {
      return NextResponse.json(
        { status: "error", error: "参照したレシピが見つかりません。選び直してください" },
        { status: 400 },
      );
    }

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
