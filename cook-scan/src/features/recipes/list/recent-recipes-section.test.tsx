import { render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, test, vi } from "vite-plus/test";
import type { RecipeBasic } from "@/types/recipe";
import { RecentRecipesSection } from "./recent-recipes-section";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe("RecentRecipesSection", () => {
  const mockRecipes: RecipeBasic[] = [
    {
      id: "1",
      title: "カレーライス",
      imageUrl: "https://example.com/curry.jpg",
      createdAt: new Date("2024-01-15"),
      ingredients: [{ id: "ing1" }, { id: "ing2" }, { id: "ing3" }],
      recipeTags: [
        {
          tagId: "tag1",
          tag: {
            id: "tag1",
            name: "和食",
          },
        },
        {
          tagId: "tag2",
          tag: {
            id: "tag2",
            name: "簡単",
          },
        },
      ],
    },
    {
      id: "2",
      title: "パスタ",
      imageUrl: null,
      createdAt: new Date("2024-02-20"),
      ingredients: [{ id: "ing4" }, { id: "ing5" }],
      recipeTags: [],
    },
    {
      id: "3",
      title: "親子丼",
      imageUrl: null,
      createdAt: new Date("2024-03-05"),
      ingredients: [{ id: "ing6" }, { id: "ing7" }],
      recipeTags: [
        {
          tagId: "tag3",
          tag: {
            id: "tag3",
            name: "丼もの",
          },
        },
      ],
    },
  ];

  test("正常系：セクションタイトルとすべて見るリンクが表示される", () => {
    render(<RecentRecipesSection recipes={mockRecipes} />);

    expect(screen.getByText("最近追加したレシピ")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /すべて見る/i })).toHaveAttribute("href", "/recipes");
  });

  test("正常系：3件のレシピカードが表示される", () => {
    render(<RecentRecipesSection recipes={mockRecipes} />);

    expect(screen.getByRole("link", { name: /カレーライス/i })).toHaveAttribute(
      "href",
      "/recipes/1",
    );
    expect(screen.getByRole("link", { name: /パスタ/i })).toHaveAttribute("href", "/recipes/2");
    expect(screen.getByRole("link", { name: /親子丼/i })).toHaveAttribute("href", "/recipes/3");
  });

  test("正常系：タイトル、材料数、作成日が表示される", () => {
    render(<RecentRecipesSection recipes={[mockRecipes[0]]} />);

    expect(screen.getByText("カレーライス")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("品目")).toBeInTheDocument();
    expect(screen.getByText("2024年1月15日")).toBeInTheDocument();
  });

  test("正常系：画像がある場合はサムネイルが表示される", () => {
    render(<RecentRecipesSection recipes={[mockRecipes[0]]} />);

    expect(screen.getByRole("img", { name: "カレーライス" })).toBeInTheDocument();
  });

  test("正常系：タグは最大3件まで表示される", () => {
    const recipeWithManyTags: RecipeBasic = {
      ...mockRecipes[0],
      recipeTags: [
        { tagId: "tag1", tag: { id: "tag1", name: "タグ1" } },
        { tagId: "tag2", tag: { id: "tag2", name: "タグ2" } },
        { tagId: "tag3", tag: { id: "tag3", name: "タグ3" } },
        { tagId: "tag4", tag: { id: "tag4", name: "タグ4" } },
      ],
    };

    render(<RecentRecipesSection recipes={[recipeWithManyTags]} />);

    expect(screen.getByText("タグ1")).toBeInTheDocument();
    expect(screen.getByText("タグ2")).toBeInTheDocument();
    expect(screen.getByText("タグ3")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(screen.queryByText("タグ4")).not.toBeInTheDocument();
  });

  test("正常系：レシピがない場合は空状態とCTAが表示される", () => {
    render(<RecentRecipesSection recipes={[]} />);

    expect(screen.getByText("最近追加したレシピがありません")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /レシピをスキャン/i })).toHaveAttribute(
      "href",
      "/recipes/upload",
    );
  });
});
