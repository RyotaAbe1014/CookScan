import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import type { NextRequest } from "next/server";
import { NextRequest as NextRequestImpl } from "next/server";
import { checkUserProfile } from "@/features/auth/auth-utils";
import { getS3Client } from "@/lib/aws/s3";

vi.mock("@/features/auth/auth-utils", () => ({
  checkUserProfile: vi.fn(),
}));

vi.mock("@/lib/aws/s3", () => ({
  getS3Client: vi.fn(),
}));

// route はモジュール読み込み時に環境変数を評価するため、import 前に設定する。
vi.stubEnv("S3_BUCKET_NAME", "test-bucket");
const { GET } = await import("./route");

const VALID_JOB_ID = "550e8400-e29b-41d4-a716-446655440000";

function buildRequest(jobId?: string): NextRequest {
  const url = new URL("http://localhost/api/recipes/extract/result");
  if (jobId !== undefined) {
    url.searchParams.set("jobId", jobId);
  }
  return new NextRequestImpl(url);
}

describe("GET /api/recipes/extract/result", () => {
  const s3Send = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: true,
      hasProfile: true,
      profile: { id: "user-1" },
    } as Awaited<ReturnType<typeof checkUserProfile>>);
    vi.mocked(getS3Client).mockReturnValue({ send: s3Send } as unknown as ReturnType<
      typeof getS3Client
    >);
  });

  it("returns OCR result for valid UUID jobId", async () => {
    s3Send.mockResolvedValueOnce({
      Body: {
        transformToString: () =>
          Promise.resolve(
            JSON.stringify({
              status: "success",
              jobId: VALID_JOB_ID,
              processedAt: "2026-01-01T00:00:00Z",
              result: { text: "抽出されたテキスト" },
              error: null,
            }),
          ),
      },
    });

    const response = await GET(buildRequest(VALID_JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "success", result: { text: "抽出されたテキスト" } });
  });

  it("returns 401 when user is not authenticated", async () => {
    vi.mocked(checkUserProfile).mockResolvedValue({
      hasAuth: false,
      hasProfile: false,
      profile: null,
    } as Awaited<ReturnType<typeof checkUserProfile>>);

    const response = await GET(buildRequest(VALID_JOB_ID));

    expect(response.status).toBe(401);
    expect(s3Send).not.toHaveBeenCalled();
  });

  it("returns 400 when jobId is missing", async () => {
    const response = await GET(buildRequest());

    expect(response.status).toBe(400);
    expect(s3Send).not.toHaveBeenCalled();
  });

  it("returns 400 when jobId is not a UUID", async () => {
    const response = await GET(buildRequest("../../other-user/job-1"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ success: false, error: "jobId が不正です" });
    expect(s3Send).not.toHaveBeenCalled();
  });
});
