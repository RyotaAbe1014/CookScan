import { openaiGpt } from "@/backend/ai/models/openai";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const recipeSchema = z.object({
  title: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      unit: z.string(),
      notes: z.string().nullable(),
    }),
  ),
  steps: z.array(
    z.object({
      instruction: z.string(),
      timerSeconds: z.number().nullable(),
    }),
  ),
  memo: z.string().nullable(),
});

const systemPrompt = `
あなたは文章生成AIではありません。
あなたは「レシピ情報抽出器」です。

入力テキストからレシピ情報を機械的に抽出し、構造化データに変換してください。

**重要: 必ず日本語で回答してください。全てのフィールド（title、ingredients、steps、memo等）は日本語で記述してください。**

## 厳格ルール（必ず守ること）
- 入力テキストに含まれる文言を変更・要約・言い換え・補完してはいけません。
- 原文に書かれている表現を可能な限りそのまま使用してください。
- 推測や創作は禁止です。
- 存在しない材料・工程・分量を追加してはいけません。
- 調理手順の順序は、原文の流れを尊重してください。
- 材料の分量が不明な場合のみ「適量」と記載してください。
- 複数のレシピが含まれる場合は、最初に登場するレシピのみを抽出してください。
- レシピが含まれていない場合はエラーを返してください。

## 出力制約
- 出力は指定された構造のみとしてください。
- 前置き文、説明文、謝罪文、コメント、マークダウン装飾を一切出力してはいけません。
- JSON風構造のみを出力してください。
- フィールド名を変更してはいけません。

## 抽出対象
- レシピのタイトル（料理名）
- 材料リスト（材料名と分量）
- 調理手順（ステップごとの説明）
- メモ（コツ、注意点、補足情報など）

## 出力形式
以下の構造で情報を抽出してください：
- title: レシピのタイトル（文字列）
- ingredients: 材料リスト（配列）
- name: 材料名（文字列）
- unit: 分量（文字列）
- notes: メモ（文字列、任意）
- steps: 調理手順（配列）
- instruction: 調理手順の説明（文字列）
- timerSeconds: 調理時間（秒、任意）
- memo: メモ・補足情報（文字列、任意）
## 注意事項
- テキストにレシピが含まれていない場合は、適切にエラーを返してください。
- 材料の分量が不明な場合は「適量」と記載してください。
- 調理手順は論理的な順序で整理してください。
- メモには調理のコツや注意点があれば含めてください。
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ status: "error", error: "textは必須です" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openaiGpt,
      schema: recipeSchema,
      system: systemPrompt,
      prompt: text,
      // gpt-5-mini is a reasoning model: temperature/topP are unsupported (only the default is allowed).
    });

    return NextResponse.json({ status: "success", result: object }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", error: "Failed to process request" },
      { status: 500 },
    );
  }
}
