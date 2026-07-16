import { describe, it, expect, vi, beforeEach, afterEach } from "vite-plus/test";
import type { NextRequest } from "next/server";
import { generateObject } from "ai";
import { checkUserProfile } from "@/features/auth/auth-utils";
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

function buildRequest(body: unknown) {
  return new Request("http://localhost/api/recipes/extract/text", {
    method: "POST",
    body: JSON.stringify(body),
  }) as NextRequest;
}

describe("POST /api/recipes/extract/text", () => {
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

  it("returns extracted recipe for valid text", async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        title: "卵チャーハン",
        ingredients: [{ name: "卵", unit: "1個", notes: null }],
        steps: [{ instruction: "卵を炒める", timerSeconds: null }],
        memo: null,
      },
    } as Awaited<ReturnType<typeof generateObject>>);

    const response = await POST(buildRequest({ text: "卵チャーハンのレシピ。卵を炒める。" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("success");
    expect(body.result.title).toBe("卵チャーハン");
  });

  it("returns 401 when user is not authenticated", async () => {
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: false,
      hasProfile: false,
      profile: null,
    } as Awaited<ReturnType<typeof checkUserProfile>>);

    const response = await POST(buildRequest({ text: "卵チャーハンのレシピ" }));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ status: "error", error: "認証が必要です" });
    expect(generateObject).not.toHaveBeenCalled();
  });

  it("returns 400 when text is missing", async () => {
    const response = await POST(buildRequest({}));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.status).toBe("error");
    expect(generateObject).not.toHaveBeenCalled();
  });

  it("returns 400 when text is empty", async () => {
    const response = await POST(buildRequest({ text: "   " }));

    expect(response.status).toBe(400);
    expect(generateObject).not.toHaveBeenCalled();
  });

  it("returns 400 when text exceeds max length", async () => {
    const response = await POST(buildRequest({ text: "あ".repeat(20001) }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("20000文字以内");
    expect(generateObject).not.toHaveBeenCalled();
  });
});
