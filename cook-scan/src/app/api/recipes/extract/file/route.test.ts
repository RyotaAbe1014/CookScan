import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import type { NextRequest } from "next/server";
import { checkUserProfile } from "@/features/auth/auth-utils";
import { getSQSClient } from "@/lib/aws/sqs";

vi.mock("@/features/auth/auth-utils", () => ({
  checkUserProfile: vi.fn(),
}));

vi.mock("@/lib/aws/sqs", () => ({
  getSQSClient: vi.fn(),
}));

// route はモジュール読み込み時に環境変数を評価するため、import 前に設定する。
vi.stubEnv("AWS_SQS_QUEUE_URL", "https://sqs.example.com/queue");
const { POST } = await import("./route");

const VALID_JOB_ID = "550e8400-e29b-41d4-a716-446655440000";

function buildRequest(body: unknown) {
  return new Request("http://localhost/api/recipes/extract/file", {
    method: "POST",
    body: JSON.stringify(body),
  }) as NextRequest;
}

describe("POST /api/recipes/extract/file", () => {
  const sqsSend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: true,
      hasProfile: true,
      profile: { id: "user-1" },
    } as Awaited<ReturnType<typeof checkUserProfile>>);
    vi.mocked(getSQSClient).mockReturnValue({ send: sqsSend } as unknown as ReturnType<
      typeof getSQSClient
    >);
  });

  it("enqueues OCR job for valid UUID jobId", async () => {
    sqsSend.mockResolvedValueOnce({});

    const response = await POST(buildRequest({ jobId: VALID_JOB_ID }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, result: { jobId: VALID_JOB_ID } });
    expect(sqsSend).toHaveBeenCalledTimes(1);
  });

  it("returns 401 when user is not authenticated", async () => {
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: false,
      hasProfile: false,
      profile: null,
    } as Awaited<ReturnType<typeof checkUserProfile>>);

    const response = await POST(buildRequest({ jobId: VALID_JOB_ID }));

    expect(response.status).toBe(401);
    expect(sqsSend).not.toHaveBeenCalled();
  });

  it("returns 400 when jobId is missing", async () => {
    const response = await POST(buildRequest({}));

    expect(response.status).toBe(400);
    expect(sqsSend).not.toHaveBeenCalled();
  });

  it("returns 400 when jobId is not a UUID", async () => {
    const response = await POST(buildRequest({ jobId: "../other-user/job-1" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ success: false, error: "jobId が不正です" });
    expect(sqsSend).not.toHaveBeenCalled();
  });
});
