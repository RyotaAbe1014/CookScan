import { describe, it, expect, vi, beforeEach } from "vite-plus/test";

vi.mock("@/backend/repositories/recipe-share.repository", () => ({
  findByShareToken: vi.fn(),
  findByRecipeId: vi.fn(),
  create: vi.fn(),
  activate: vi.fn(),
  deactivate: vi.fn(),
}));

vi.mock("@/backend/repositories/recipe.repository", () => ({
  checkRecipeOwnership: vi.fn(),
}));

import type { SharedRecipeOutput, ShareInfoOutput } from "@/backend/domain/recipes";
import * as RecipeShareRepository from "@/backend/repositories/recipe-share.repository";
import * as RecipeRepository from "@/backend/repositories/recipe.repository";
import { getSharedRecipe, createShare, removeShare, getShareInfo } from "../recipe-share.service";

describe("recipe-share.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===== getSharedRecipe =====

  describe("getSharedRecipe", () => {
    it("正常系: 共有トークンからレシピを取得できる", async () => {
      const mockRecipe: SharedRecipeOutput = {
        title: "テストレシピ",
        imageUrl: "https://example.com/image.jpg",
        ingredients: [{ name: "卵", unit: "2個", notes: null }],
        steps: [{ orderIndex: 1, instruction: "卵を割る", timerSeconds: null }],
      };
      vi.mocked(RecipeShareRepository.findByShareToken).mockResolvedValueOnce(mockRecipe);

      const result = await getSharedRecipe("valid-token");

      expect(result).toEqual(mockRecipe);
      expect(RecipeShareRepository.findByShareToken).toHaveBeenCalledWith("valid-token");
    });

    it("正常系: 無効なトークンの場合はnullを返す", async () => {
      vi.mocked(RecipeShareRepository.findByShareToken).mockResolvedValueOnce(null);

      const result = await getSharedRecipe("invalid-token");

      expect(result).toBeNull();
    });
  });

  // ===== createShare =====

  describe("createShare", () => {
    it("正常系: 新規共有リンクを作成できる", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(true);
      vi.mocked(RecipeShareRepository.findByRecipeId).mockResolvedValueOnce(null);
      const mockShare: ShareInfoOutput = { shareToken: "new-token", isActive: true };
      vi.mocked(RecipeShareRepository.create).mockResolvedValueOnce(mockShare);

      const result = await createShare("user-1", "recipe-1");

      expect(result).toEqual(mockShare);
      expect(RecipeRepository.checkRecipeOwnership).toHaveBeenCalledWith("recipe-1", "user-1");
      expect(RecipeShareRepository.findByRecipeId).toHaveBeenCalledWith("recipe-1");
      expect(RecipeShareRepository.create).toHaveBeenCalledWith("recipe-1", expect.any(String));
    });

    it("正常系: 既存のアクティブな共有がある場合はそのまま返す", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(true);
      const existingShare: ShareInfoOutput = { shareToken: "existing-token", isActive: true };
      vi.mocked(RecipeShareRepository.findByRecipeId).mockResolvedValueOnce(existingShare);

      const result = await createShare("user-1", "recipe-1");

      expect(result).toEqual(existingShare);
      expect(RecipeShareRepository.create).not.toHaveBeenCalled();
      expect(RecipeShareRepository.activate).not.toHaveBeenCalled();
    });

    it("正常系: 無効化された共有がある場合は再有効化する", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(true);
      const inactiveShare: ShareInfoOutput = { shareToken: "old-token", isActive: false };
      vi.mocked(RecipeShareRepository.findByRecipeId).mockResolvedValueOnce(inactiveShare);
      const reactivatedShare: ShareInfoOutput = { shareToken: "old-token", isActive: true };
      vi.mocked(RecipeShareRepository.activate).mockResolvedValueOnce(reactivatedShare);

      const result = await createShare("user-1", "recipe-1");

      expect(result).toEqual(reactivatedShare);
      expect(RecipeShareRepository.activate).toHaveBeenCalledWith("recipe-1");
      expect(RecipeShareRepository.create).not.toHaveBeenCalled();
    });

    it("エラー: レシピの所有権がない場合はnullを返す", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(false);

      const result = await createShare("user-1", "recipe-1");

      expect(result).toBeNull();
      expect(RecipeShareRepository.findByRecipeId).not.toHaveBeenCalled();
    });
  });

  // ===== removeShare =====

  describe("removeShare", () => {
    it("正常系: 共有リンクを無効化できる", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(true);
      const activeShare: ShareInfoOutput = { shareToken: "token", isActive: true };
      vi.mocked(RecipeShareRepository.findByRecipeId).mockResolvedValueOnce(activeShare);

      const result = await removeShare("user-1", "recipe-1");

      expect(result).toBe(true);
      expect(RecipeShareRepository.deactivate).toHaveBeenCalledWith("recipe-1");
    });

    it("エラー: レシピの所有権がない場合はfalseを返す", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(false);

      const result = await removeShare("user-1", "recipe-1");

      expect(result).toBe(false);
      expect(RecipeShareRepository.findByRecipeId).not.toHaveBeenCalled();
    });

    it("エラー: 共有が存在しない場合はfalseを返す", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(true);
      vi.mocked(RecipeShareRepository.findByRecipeId).mockResolvedValueOnce(null);

      const result = await removeShare("user-1", "recipe-1");

      expect(result).toBe(false);
      expect(RecipeShareRepository.deactivate).not.toHaveBeenCalled();
    });

    it("エラー: 既に無効化されている場合はfalseを返す", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(true);
      const inactiveShare: ShareInfoOutput = { shareToken: "token", isActive: false };
      vi.mocked(RecipeShareRepository.findByRecipeId).mockResolvedValueOnce(inactiveShare);

      const result = await removeShare("user-1", "recipe-1");

      expect(result).toBe(false);
      expect(RecipeShareRepository.deactivate).not.toHaveBeenCalled();
    });
  });

  // ===== getShareInfo =====

  describe("getShareInfo", () => {
    it("正常系: 共有情報を取得できる", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(true);
      const mockShare: ShareInfoOutput = { shareToken: "token", isActive: true };
      vi.mocked(RecipeShareRepository.findByRecipeId).mockResolvedValueOnce(mockShare);

      const result = await getShareInfo("user-1", "recipe-1");

      expect(result).toEqual(mockShare);
      expect(RecipeRepository.checkRecipeOwnership).toHaveBeenCalledWith("recipe-1", "user-1");
      expect(RecipeShareRepository.findByRecipeId).toHaveBeenCalledWith("recipe-1");
    });

    it("正常系: 共有が存在しない場合はnullを返す", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(true);
      vi.mocked(RecipeShareRepository.findByRecipeId).mockResolvedValueOnce(null);

      const result = await getShareInfo("user-1", "recipe-1");

      expect(result).toBeNull();
    });

    it("エラー: レシピの所有権がない場合はnullを返す", async () => {
      vi.mocked(RecipeRepository.checkRecipeOwnership).mockResolvedValueOnce(false);

      const result = await getShareInfo("user-1", "recipe-1");

      expect(result).toBeNull();
      expect(RecipeShareRepository.findByRecipeId).not.toHaveBeenCalled();
    });
  });
});
