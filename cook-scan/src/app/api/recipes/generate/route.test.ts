import { describe, it, expect, vi, beforeEach, afterEach } from "vite-plus/test";
import type { NextRequest } from "next/server";
import { generateText } from "ai";
import { POST } from "./route";

vi.mock("ai", () => ({
  generateText: vi.fn(),
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

  it("returns generated markdown", async () => {
    vi.mocked(generateText).mockResolvedValueOnce({
      text: "この材料なら作れます。\n\n## レシピ名\n卵チャーハン",
    } as Awaited<ReturnType<typeof generateText>>);

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
        markdown: "この材料なら作れます。\n\n## レシピ名\n卵チャーハン",
      },
    });
    expect(generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "mock-openai-model",
        prompt: "ユーザー:\n卵とご飯で簡単に作りたい",
      }),
    );
  });

  it("passes conversation history to prompt", async () => {
    vi.mocked(generateText).mockResolvedValueOnce({
      text: "時短版にします。",
    } as Awaited<ReturnType<typeof generateText>>);

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

    expect(generateText).toHaveBeenCalledWith(
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
    expect(generateText).not.toHaveBeenCalled();
  });

  it("returns 500 when generation fails", async () => {
    vi.mocked(generateText).mockRejectedValueOnce(new Error("AI error"));

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
