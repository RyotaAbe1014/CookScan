import { describe, it, expect, vi, beforeEach } from "vite-plus/test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReferenceRecipePicker } from "../reference-recipe-picker";

vi.mock("@/features/recipes/list/actions", () => ({
  getRecipesWithFilters: vi.fn(),
}));

// Radix Dialog Portal をインラインレンダリングに変更
vi.mock("@radix-ui/react-dialog", async () => {
  const actual =
    await vi.importActual<typeof import("@radix-ui/react-dialog")>("@radix-ui/react-dialog");
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  };
});

import { getRecipesWithFilters } from "@/features/recipes/list/actions";

// getRecipesWithFilters が返す RecipeListOutput の最小スタブ。
function buildListItem(id: string, title: string) {
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

describe("ReferenceRecipePicker", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    selected: [] as { id: string; title: string }[],
    onConfirm: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRecipesWithFilters).mockResolvedValue({
      ok: true,
      data: [buildListItem("recipe-1", "カレー"), buildListItem("recipe-2", "シチュー")],
    });
  });

  it("open=false のときは表示されない", () => {
    render(<ReferenceRecipePicker {...defaultProps} open={false} />);
    expect(screen.queryByText("参照するレシピを選ぶ")).not.toBeInTheDocument();
  });

  it("開くとレシピ一覧が表示される", async () => {
    render(<ReferenceRecipePicker {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("カレー")).toBeInTheDocument();
      expect(screen.getByText("シチュー")).toBeInTheDocument();
    });
  });

  it("複数選択して確定すると、選んだレシピが onConfirm に渡る", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<ReferenceRecipePicker {...defaultProps} onConfirm={onConfirm} />);

    await waitFor(() => {
      expect(screen.getByText("カレー")).toBeInTheDocument();
    });

    await user.click(screen.getByText("カレー"));
    await user.click(screen.getByText("シチュー"));
    await user.click(screen.getByRole("button", { name: /2件を参照に追加/ }));

    expect(onConfirm).toHaveBeenCalledWith([
      { id: "recipe-1", title: "カレー" },
      { id: "recipe-2", title: "シチュー" },
    ]);
  });

  it("既に参照中のレシピは初期選択として復元される", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ReferenceRecipePicker
        {...defaultProps}
        selected={[{ id: "recipe-1", title: "カレー" }]}
        onConfirm={onConfirm}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("カレー")).toBeInTheDocument();
    });

    // 復元済みの1件がボタンラベルに反映されている
    expect(screen.getByRole("button", { name: /1件を参照に追加/ })).toBeInTheDocument();

    // そのまま確定すると初期選択がそのまま渡る
    await user.click(screen.getByRole("button", { name: /1件を参照に追加/ }));
    expect(onConfirm).toHaveBeenCalledWith([{ id: "recipe-1", title: "カレー" }]);
  });

  it("検索クエリ入力で getRecipesWithFilters が呼ばれる", async () => {
    const user = userEvent.setup();
    render(<ReferenceRecipePicker {...defaultProps} />);

    await waitFor(() => {
      expect(getRecipesWithFilters).toHaveBeenCalledWith("", []);
    });

    await user.type(screen.getByPlaceholderText("レシピ名で検索"), "カレー");

    await waitFor(() => {
      expect(getRecipesWithFilters).toHaveBeenCalledWith("カレー", []);
    });
  });

  it("取得失敗時はエラーを表示する", async () => {
    vi.mocked(getRecipesWithFilters).mockResolvedValue({
      ok: false,
      error: { code: "SERVER_ERROR", message: "レシピの取得に失敗しました" },
    });
    render(<ReferenceRecipePicker {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("レシピの取得に失敗しました")).toBeInTheDocument();
    });
  });
});
