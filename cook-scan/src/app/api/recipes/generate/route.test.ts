import { describe, it, expect, vi, beforeEach, afterEach } from "vite-plus/test";
import type { NextRequest } from "next/server";
import { generateObject } from "ai";
import { POST } from "./route";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@/backend/ai/models/openai", () => ({
  openaiGpt: "mock-openai-model",
}));

describe("POST /api/recipes/generate", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
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
});
