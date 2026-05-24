import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AiRecipeGenerator } from "../ai-recipe-generator";

global.fetch = vi.fn();

describe("AiRecipeGenerator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the AI recipe generation form", () => {
    render(<AiRecipeGenerator />);

    expect(screen.getByText("AIで献立・レシピ提案")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/冷蔵庫に鶏むね肉/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /レシピを提案/ })).toBeInTheDocument();
  });

  it("shows error and does not call API when prompt is empty", async () => {
    const user = userEvent.setup();
    render(<AiRecipeGenerator />);

    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    expect(screen.getByText("希望や食材を入力してください")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("shows generated markdown when API returns success", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        result: {
          markdown: "この材料なら作れます。\n\n## レシピ名\n鶏むね肉の卵とじ",
        },
      }),
    });

    render(<AiRecipeGenerator />);

    await user.type(
      screen.getByPlaceholderText(/冷蔵庫に鶏むね肉/),
      "鶏むね肉と卵で20分以内の夕飯にしたい",
    );
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(screen.getByText(/鶏むね肉の卵とじ/)).toBeInTheDocument();
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

  it("sends follow-up message with conversation history", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        json: async () => ({
          status: "success",
          result: {
            markdown: "## レシピ名\n鶏むね肉の卵とじ",
          },
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          status: "success",
          result: {
            markdown: "さらに時短するなら、鶏むね肉を薄めに切ります。",
          },
        }),
      });

    render(<AiRecipeGenerator />);

    await user.type(
      screen.getByPlaceholderText(/冷蔵庫に鶏むね肉/),
      "鶏むね肉と卵で20分以内の夕飯にしたい",
    );
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(screen.getByText(/鶏むね肉の卵とじ/)).toBeInTheDocument();
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
            { role: "assistant", content: "## レシピ名\n鶏むね肉の卵とじ" },
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

    render(<AiRecipeGenerator />);

    await user.type(screen.getByPlaceholderText(/冷蔵庫に鶏むね肉/), "卵と米で作りたい");
    await user.click(screen.getByRole("button", { name: /レシピを提案/ }));

    await waitFor(() => {
      expect(screen.getByText("レシピ生成に失敗しました")).toBeInTheDocument();
    });
  });
});
