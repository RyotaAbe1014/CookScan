import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AiRecipeGenerator } from "../ai-recipe-generator";
import type { CreateRecipeRequest } from "../types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockCreateRecipe = vi.fn();
vi.mock("../actions", () => ({
  createRecipe: (...args: [CreateRecipeRequest]) => mockCreateRecipe(...args),
}));

// 参照レシピ選択モーダルが使う Server Action をモック。
vi.mock("@/features/recipes/list/actions", () => ({
  getRecipesWithFilters: vi.fn(),
}));

// Radix Dialog Portal をインラインレンダリングに変更（モーダル内容をテスト可能にする）。
vi.mock("@radix-ui/react-dialog", async () => {
  const actual =
    await vi.importActual<typeof import("@radix-ui/react-dialog")>("@radix-ui/react-dialog");
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  };
});

import { getRecipesWithFilters } from "@/features/recipes/list/actions";

function buildReferenceListItem(id: string, title: string) {
  return {
    id,
    userId: "user-1",
    title,
    imageUrl: null,
    memo: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ingredients: [],
    recipeTags: [],
  };
}

global.fetch = vi.fn();

describe("AiRecipeGenerator", () => {
  const mockTagCategories = [
    {
      id: "cat1",
      name: "カテゴリ1",
      description: null,
      tags: [{ id: "tag1", name: "タグ1", description: null }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateRecipe.mockResolvedValue({ ok: true, data: { recipeId: "recipe-1" } });
    vi.mocked(getRecipesWithFilters).mockResolvedValue({
      ok: true,
      data: [
        buildReferenceListItem("recipe-1", "カレー"),
        buildReferenceListItem("recipe-2", "シチュー"),
      ],
    });
  });

  it("renders the AI recipe generation form", () => {
    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    expect(screen.getByText("AIで献立・レシピ提案")).toBeInTheDocument();
    expect(screen.getByText(/冷蔵庫にある食材や/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/鶏むね肉、玉ねぎ、卵/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /レシピを提案/ })).toBeDisabled();
  });

  it("does not call API when prompt is empty", async () => {
    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    expect(screen.getByRole("button", { name: /レシピを提案/ })).toBeDisabled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("submits with Enter", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        result: {
          message: "この材料なら作れます。",
          intent: "chat",
          recipeDraft: null,
          suggestions: ["もっと時短にする"],
        },
      }),
    });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.type(
      screen.getByPlaceholderText(/鶏むね肉、玉ねぎ、卵/),
      "鶏むね肉と卵で作りたい{Enter}",
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("shows chat message when API returns chat response", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        result: {
          message: "この材料なら作れます。",
          intent: "chat",
          recipeDraft: null,
          suggestions: ["もっと時短にする", "買い足しなしにする"],
        },
      }),
    });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.type(
      screen.getByPlaceholderText(/鶏むね肉、玉ねぎ、卵/),
      "鶏むね肉と卵で20分以内の夕飯にしたい",
    );
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(screen.getByText("この材料なら作れます。")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "もっと時短にする" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "買い足しなしにする" })).toBeInTheDocument();
    expect(screen.getByText("鶏むね肉と卵で20分以内の夕飯にしたい")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/recipes/generate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: "鶏むね肉と卵で20分以内の夕飯にしたい" }],
        }),
      }),
    );
  });

  it("shows recipe draft form when API returns recipe draft", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        result: {
          message: "レシピ下書きを作りました。",
          intent: "recipe_draft",
          recipeDraft: {
            title: "鶏むね肉の卵とじ",
            ingredients: [{ name: "鶏むね肉", unit: "200g", notes: null }],
            steps: [{ instruction: "鶏むね肉を焼く", timerSeconds: null }],
            memo: "足りないもの: なし",
          },
          suggestions: ["子供向けにする"],
        },
      }),
    });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.type(
      screen.getByPlaceholderText(/鶏むね肉、玉ねぎ、卵/),
      "鶏むね肉と卵で20分以内の夕飯にしたい",
    );
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(screen.getByText("レシピ下書き")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("鶏むね肉の卵とじ")).toBeInTheDocument();
    expect(screen.getByDisplayValue("鶏むね肉")).toBeInTheDocument();
    expect(screen.getByDisplayValue("鶏むね肉を焼く")).toBeInTheDocument();
  });

  it("saves edited recipe draft", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        result: {
          message: "レシピ下書きを作りました。",
          intent: "recipe_draft",
          recipeDraft: {
            title: "鶏むね肉の卵とじ",
            ingredients: [{ name: "鶏むね肉", unit: "200g", notes: null }],
            steps: [{ instruction: "鶏むね肉を焼く", timerSeconds: null }],
            memo: "足りないもの: なし",
          },
          suggestions: ["保存前に調整する"],
        },
      }),
    });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.type(
      screen.getByPlaceholderText(/鶏むね肉、玉ねぎ、卵/),
      "鶏むね肉と卵で20分以内の夕飯にしたい",
    );
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(screen.getByDisplayValue("鶏むね肉の卵とじ")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/レシピタイトル/);
    await user.clear(titleInput);
    await user.type(titleInput, "編集したレシピ");
    await user.click(screen.getByRole("button", { name: /レシピを保存/ }));

    await waitFor(() => {
      expect(mockCreateRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "編集したレシピ",
          ingredients: [expect.objectContaining({ name: "鶏むね肉", unit: "200g" })],
          steps: [expect.objectContaining({ instruction: "鶏むね肉を焼く" })],
          tags: [],
          childRecipes: [],
        }),
      );
    });
    expect(mockPush).toHaveBeenCalledWith("/recipes/recipe-1");
  });

  it("sends follow-up message with conversation history", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        json: async () => ({
          status: "success",
          result: {
            message: "レシピ下書きを作りました。",
            intent: "recipe_draft",
            recipeDraft: {
              title: "鶏むね肉の卵とじ",
              ingredients: [{ name: "鶏むね肉", unit: "200g", notes: null }],
              steps: [{ instruction: "鶏むね肉を焼く", timerSeconds: null }],
              memo: null,
            },
            suggestions: ["もっと時短にして"],
          },
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          status: "success",
          result: {
            message: "さらに時短するなら、鶏むね肉を薄めに切ります。",
            intent: "chat",
            recipeDraft: null,
            suggestions: ["買い足しなしで作る"],
          },
        }),
      });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.type(
      screen.getByPlaceholderText(/鶏むね肉、玉ねぎ、卵/),
      "鶏むね肉と卵で20分以内の夕飯にしたい",
    );
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(screen.getByText("レシピ下書きを作りました。")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "もっと時短にして" }));

    await waitFor(() => {
      expect(screen.getByText(/さらに時短するなら/)).toBeInTheDocument();
    });
    const lastCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.at(-1)!;
    const requestInit = lastCall[1] as RequestInit;
    const body = JSON.parse(requestInit.body as string);
    expect(lastCall[0]).toBe("/api/recipes/generate");
    expect(requestInit.method).toBe("POST");
    expect(body.messages).toHaveLength(3);
    expect(body.messages[1].content).toContain("レシピ下書き:");
    expect(body.messages[1].content).toContain("タイトル: 鶏むね肉の卵とじ");
    expect(body.messages[2]).toEqual({ role: "user", content: "もっと時短にして" });
  });

  it("shows error when API returns error", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({
        status: "error",
        error: "レシピ生成に失敗しました",
      }),
    });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.type(screen.getByPlaceholderText(/鶏むね肉、玉ねぎ、卵/), "卵と米で作りたい");
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(screen.getByText("レシピ生成に失敗しました")).toBeInTheDocument();
    });
  });

  it("参照レシピを選んで送信すると referenceRecipeIds が body に含まれる", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        result: {
          message: "2つを合わせた下書きです。",
          intent: "chat",
          recipeDraft: null,
          suggestions: ["辛くする"],
        },
      }),
    });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    // モーダルを開いてレシピを2件選び、参照に追加する
    await user.click(screen.getByRole("button", { name: /レシピを参照/ }));
    await waitFor(() => {
      expect(screen.getByText("カレー")).toBeInTheDocument();
    });
    await user.click(screen.getByText("カレー"));
    await user.click(screen.getByText("シチュー"));
    await user.click(screen.getByRole("button", { name: /2件を参照に追加/ }));

    // チップが表示される
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /カレーを参照から外す/ })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /シチューを参照から外す/ })).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/鶏むね肉、玉ねぎ、卵/), "この2つを合体させて");
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    const lastCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.at(-1)!;
    const body = JSON.parse((lastCall[1] as RequestInit).body as string);
    expect(body.referenceRecipeIds).toEqual(["recipe-1", "recipe-2"]);
    expect(body.messages).toEqual([{ role: "user", content: "この2つを合体させて" }]);
  });

  it("チップの×で参照を外すと referenceRecipeIds から除外される", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        result: {
          message: "カレーをアレンジします。",
          intent: "chat",
          recipeDraft: null,
          suggestions: ["辛くする"],
        },
      }),
    });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.click(screen.getByRole("button", { name: /レシピを参照/ }));
    await waitFor(() => {
      expect(screen.getByText("カレー")).toBeInTheDocument();
    });
    await user.click(screen.getByText("カレー"));
    await user.click(screen.getByText("シチュー"));
    await user.click(screen.getByRole("button", { name: /2件を参照に追加/ }));

    // シチューのチップを外す
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /シチューを参照から外す/ })).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: /シチューを参照から外す/ }));

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /シチューを参照から外す/ }),
      ).not.toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/鶏むね肉、玉ねぎ、卵/), "カレーをアレンジして");
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    const lastCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.at(-1)!;
    const body = JSON.parse((lastCall[1] as RequestInit).body as string);
    expect(body.referenceRecipeIds).toEqual(["recipe-1"]);
  });
});
