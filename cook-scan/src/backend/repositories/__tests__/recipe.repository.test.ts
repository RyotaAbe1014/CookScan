import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    recipe: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { findRecentRecipesByUser } from "../recipe.repository";

describe("recipe.repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findRecentRecipesByUser", () => {
    it("正常系: createdAt降順かつ指定件数で最近追加したレシピを取得するクエリを組み立てる", async () => {
      vi.mocked(prisma.recipe.findMany).mockResolvedValueOnce([]);

      await findRecentRecipesByUser("user-1", 3);

      expect(prisma.recipe.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          createdAt: true,
          ingredients: {
            select: { id: true },
          },
          recipeTags: {
            select: {
              tagId: true,
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      });
    });
  });
});
