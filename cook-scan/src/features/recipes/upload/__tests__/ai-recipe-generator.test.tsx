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
  });

  it("renders the AI recipe generation form", () => {
    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    expect(screen.getByText("AIで献立・レシピ提案")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/冷蔵庫に鶏むね肉/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /レシピを提案/ })).toBeInTheDocument();
  });

  it("shows error and does not call API when prompt is empty", async () => {
    const user = userEvent.setup();
    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    expect(screen.getByText("希望や食材を入力してください")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
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
        },
      }),
    });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.type(
      screen.getByPlaceholderText(/冷蔵庫に鶏むね肉/),
      "鶏むね肉と卵で20分以内の夕飯にしたい",
    );
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(screen.getByText("この材料なら作れます。")).toBeInTheDocument();
    });
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
        },
      }),
    });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.type(
      screen.getByPlaceholderText(/冷蔵庫に鶏むね肉/),
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
        },
      }),
    });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.type(
      screen.getByPlaceholderText(/冷蔵庫に鶏むね肉/),
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
          },
        }),
      });

    render(<AiRecipeGenerator tagCategories={mockTagCategories} />);

    await user.type(
      screen.getByPlaceholderText(/冷蔵庫に鶏むね肉/),
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
    expect(global.fetch).toHaveBeenLastCalledWith(
      "/api/recipes/generate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          messages: [
            { role: "user", content: "鶏むね肉と卵で20分以内の夕飯にしたい" },
            { role: "assistant", content: "レシピ下書きを作りました。" },
            { role: "user", content: "もっと時短にして" },
          ],
        }),
      }),
    );
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

    await user.type(screen.getByPlaceholderText(/冷蔵庫に鶏むね肉/), "卵と米で作りたい");
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(screen.getByText("レシピ生成に失敗しました")).toBeInTheDocument();
    });
  });
});
