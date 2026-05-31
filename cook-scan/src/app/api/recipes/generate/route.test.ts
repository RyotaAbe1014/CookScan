import { describe, it, expect, vi, beforeEach, afterEach } from "vite-plus/test";
import type { NextRequest } from "next/server";
import { generateObject } from "ai";
import { checkUserProfile } from "@/features/auth/auth-utils";
import * as RecipeRepository from "@/backend/repositories/recipe.repository";
import { POST } from "./route";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@/backend/ai/models/openai", () => ({
  openaiGpt: "mock-openai-model",
}));

vi.mock("@/features/auth/auth-utils", () => ({
  checkUserProfile: vi.fn(),
}));

vi.mock("@/backend/repositories/recipe.repository", () => ({
  findRecipeById: vi.fn(),
}));

const RECIPE_ID_A = "550e8400-e29b-41d4-a716-446655440000";
const RECIPE_ID_B = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

// findRecipeById が返す RecipeDetailOutput の最小スタブ。
function buildRecipeDetail(id: string, title: string) {
  return {
    id,
    userId: "user-1",
    title,
    imageUrl: null,
    memo: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ingredients: [
      {
        id: `${id}-ing`,
        recipeId: id,
        name: "鶏肉",
        unit: "100g",
        notes: null,
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01"),
      },
    ],
    steps: [
      {
        id: `${id}-step`,
        recipeId: id,
        orderIndex: 1,
        instruction: "焼く",
        timerSeconds: null,
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01"),
      },
    ],
    recipeTags: [],
    sourceInfo: [],
    childRecipes: [],
    parentRecipes: [],
  } as Awaited<ReturnType<typeof RecipeRepository.findRecipeById>>;
}

describe("POST /api/recipes/generate", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトは認証済みユーザー。未認証ケースは各テストで上書きする。
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: true,
      hasProfile: true,
      profile: { id: "user-1" },
    } as Awaited<ReturnType<typeof checkUserProfile>>);
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it("returns generated recipe draft", async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        message: "卵チャーハンの下書きを作りました。",
        intent: "recipe_draft",
        recipeDraft: {
          title: "卵チャーハン",
          ingredients: [{ name: "卵", unit: "1個", notes: null }],
          steps: [{ instruction: "卵を炒める", timerSeconds: null }],
          memo: "足りないもの: なし",
        },
        suggestions: ["もっと時短にする", "買い足しなしにする"],
      },
    } as Awaited<ReturnType<typeof generateObject>>);

    const response = await POST(
      new Request("http://localhost/api/recipes/generate", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: "卵とご飯で簡単に作りたい" }],
        }),
      }) as NextRequest,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      status: "success",
      result: {
        message: "卵チャーハンの下書きを作りました。",
        intent: "recipe_draft",
        recipeDraft: {
          title: "卵チャーハン",
          ingredients: [{ name: "卵", unit: "1個", notes: null }],
          steps: [{ instruction: "卵を炒める", timerSeconds: null }],
          memo: "足りないもの: なし",
        },
        suggestions: ["もっと時短にする", "買い足しなしにする"],
      },
    });
    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "mock-openai-model",
        prompt: "ユーザー:\n卵とご飯で簡単に作りたい",
      }),
    );
  });

  it("passes conversation history to prompt", async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        message: "時短版にします。",
        intent: "chat",
        recipeDraft: null,
        suggestions: ["さらに簡単にする"],
      },
    } as Awaited<ReturnType<typeof generateObject>>);

    await POST(
      new Request("http://localhost/api/recipes/generate", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            { role: "user", content: "鶏肉で作りたい" },
            { role: "assistant", content: "## レシピ名\n鶏肉炒め" },
            { role: "user", content: "もっと時短にして" },
          ],
        }),
      }) as NextRequest,
    );

    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt:
          "ユーザー:\n鶏肉で作りたい\n\n---\n\nアシスタント:\n## レシピ名\n鶏肉炒め\n\n---\n\nユーザー:\nもっと時短にして",
      }),
    );
  });

  it("returns 400 when prompt is invalid", async () => {
    const response = await POST(
      new Request("http://localhost/api/recipes/generate", {
        method: "POST",
        body: JSON.stringify({ messages: [] }),
      }) as NextRequest,
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.status).toBe("error");
    expect(generateObject).not.toHaveBeenCalled();
  });

  it("returns 500 when generation fails", async () => {
    vi.mocked(generateObject).mockRejectedValueOnce(new Error("AI error"));

    const response = await POST(
      new Request("http://localhost/api/recipes/generate", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: "鶏肉と玉ねぎで作りたい" }],
        }),
      }) as NextRequest,
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      status: "error",
      error: "レシピ生成に失敗しました",
    });
  });

  it("injects reference recipes into the prompt when referenceRecipeIds are provided", async () => {
    vi.mocked(RecipeRepository.findRecipeById)
      .mockResolvedValueOnce(buildRecipeDetail(RECIPE_ID_A, "鶏の照り焼き"))
      .mockResolvedValueOnce(buildRecipeDetail(RECIPE_ID_B, "野菜炒め"));
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        message: "2つを合わせた下書きです。",
        intent: "recipe_draft",
        recipeDraft: {
          title: "鶏と野菜の炒め物",
          ingredients: [{ name: "鶏肉", unit: "100g", notes: null }],
          steps: [{ instruction: "炒める", timerSeconds: null }],
          memo: null,
        },
        suggestions: ["辛くする"],
      },
    } as Awaited<ReturnType<typeof generateObject>>);

    const response = await POST(
      new Request("http://localhost/api/recipes/generate", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: "この2つを合体させて" }],
          referenceRecipeIds: [RECIPE_ID_A, RECIPE_ID_B],
        }),
      }) as NextRequest,
    );

    expect(response.status).toBe(200);
    expect(RecipeRepository.findRecipeById).toHaveBeenCalledWith(RECIPE_ID_A, "user-1");
    expect(RecipeRepository.findRecipeById).toHaveBeenCalledWith(RECIPE_ID_B, "user-1");

    const promptArg = vi.mocked(generateObject).mock.calls[0]?.[0]?.prompt as string;
    expect(promptArg).toContain("参照レシピ1:");
    expect(promptArg).toContain("鶏の照り焼き");
    expect(promptArg).toContain("参照レシピ2:");
    expect(promptArg).toContain("野菜炒め");
    expect(promptArg).toContain("この2つを合体させて");
  });

  it("returns 400 when a reference recipe is not found", async () => {
    // 1件目は存在、2件目は見つからない（削除済み or 他人のレシピ）。
    vi.mocked(RecipeRepository.findRecipeById)
      .mockResolvedValueOnce(buildRecipeDetail(RECIPE_ID_A, "鶏の照り焼き"))
      .mockResolvedValueOnce(null);

    const response = await POST(
      new Request("http://localhost/api/recipes/generate", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: "これをアレンジして" }],
          referenceRecipeIds: [RECIPE_ID_A, RECIPE_ID_B],
        }),
      }) as NextRequest,
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      status: "error",
      error: "参照したレシピが見つかりません。選び直してください",
    });
    expect(generateObject).not.toHaveBeenCalled();
  });

  it("returns 401 when unauthenticated, even without reference recipes", async () => {
    // 参照レシピの有無に関わらず、LLM呼び出しを伴うため認証は必須。
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: false,
      hasProfile: false,
    } as Awaited<ReturnType<typeof checkUserProfile>>);

    const response = await POST(
      new Request("http://localhost/api/recipes/generate", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: "鶏むね肉と卵で作りたい" }],
        }),
      }) as NextRequest,
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ status: "error", error: "認証が必要です" });
    expect(generateObject).not.toHaveBeenCalled();
  });

  it("returns 401 when referencing recipes without authentication", async () => {
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: false,
      hasProfile: false,
    } as Awaited<ReturnType<typeof checkUserProfile>>);

    const response = await POST(
      new Request("http://localhost/api/recipes/generate", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: "これをアレンジして" }],
          referenceRecipeIds: [RECIPE_ID_A],
        }),
      }) as NextRequest,
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ status: "error", error: "認証が必要です" });
    expect(RecipeRepository.findRecipeById).not.toHaveBeenCalled();
    expect(generateObject).not.toHaveBeenCalled();
  });
});
