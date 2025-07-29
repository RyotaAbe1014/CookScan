"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 材料のスキーマ
const ingredientSchema = z.object({
  name: z.string().min(1, "材料名は必須です"),
  unit: z.string().optional(),
  orderIndex: z.number().int().min(0),
  notes: z.string().optional(),
});

// 調理手順のスキーマ
const stepSchema = z.object({
  stepNumber: z.number().int().min(1),
  instruction: z.string().min(1, "手順の説明は必須です"),
  timerMinutes: z.number().int().min(0).optional(),
});

// レシピ作成のスキーマ
const createRecipeSchema = z.object({
  title: z.string().min(1, "レシピタイトルは必須です").max(255),
  parentRecipeId: z.string().uuid().optional(),
  sourceInfo: z
    .object({
      bookName: z.string().optional(),
      pageNumber: z.number().optional(),
      url: z.string().url().optional(),
    })
    .optional(),
  imageUrl: z.string().url().optional(),
  ingredients: z.array(ingredientSchema).min(1, "材料は最低1つ必要です"),
  steps: z.array(stepSchema).min(1, "手順は最低1つ必要です"),
  tagIds: z.array(z.string().uuid()).optional(),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;

export async function createRecipe(input: CreateRecipeInput) {
  const supabase = await createClient();
  
  // ユーザー認証チェック
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "認証されていません" };
  }

  // バリデーション
  const validationResult = createRecipeSchema.safeParse(input);
  if (!validationResult.success) {
    return {
      error: "入力データが無効です",
      details: validationResult.error.flatten(),
    };
  }

  const { title, parentRecipeId, sourceInfo, imageUrl, ingredients, steps, tagIds } = validationResult.data;

  try {
    // ユーザー情報を取得
    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!dbUser) {
      return { error: "ユーザー情報が見つかりません" };
    }

    // トランザクションでレシピ、材料、手順を作成
    const recipe = await prisma.$transaction(async (tx) => {
      // レシピを作成
      const newRecipe = await tx.recipe.create({
        data: {
          userId: dbUser.id,
          title,
          parentRecipeId,
          sourceInfo,
          imageUrl,
          ingredients: {
            create: ingredients.map((ingredient) => ({
              name: ingredient.name,
              unit: ingredient.unit,
              orderIndex: ingredient.orderIndex,
              notes: ingredient.notes,
            })),
          },
          steps: {
            create: steps.map((step) => ({
              stepNumber: step.stepNumber,
              instruction: step.instruction,
              timerMinutes: step.timerMinutes,
            })),
          },
          ...(tagIds && tagIds.length > 0
            ? {
                recipeTags: {
                  create: tagIds.map((tagId) => ({
                    tagId,
                  })),
                },
              }
            : {}),
        },
        include: {
          ingredients: true,
          steps: {
            orderBy: {
              stepNumber: "asc",
            },
          },
          recipeTags: {
            include: {
              tag: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      return newRecipe;
    });

    // キャッシュを再検証
    revalidatePath("/dashboard");
    revalidatePath(`/recipes/${recipe.id}`);

    return { success: true, recipe };
  } catch (error) {
    console.error("レシピ作成エラー:", error);
    return { error: "レシピの作成に失敗しました" };
  }
}

// レシピ更新のスキーマ
const updateRecipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  sourceInfo: z
    .object({
      bookName: z.string().optional(),
      pageNumber: z.number().optional(),
      url: z.string().url().optional(),
    })
    .optional(),
  imageUrl: z.string().url().optional(),
  ingredients: z.array(ingredientSchema).optional(),
  steps: z.array(stepSchema).optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;

export async function updateRecipe(input: UpdateRecipeInput) {
  const supabase = await createClient();
  
  // ユーザー認証チェック
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "認証されていません" };
  }

  // バリデーション
  const validationResult = updateRecipeSchema.safeParse(input);
  if (!validationResult.success) {
    return {
      error: "入力データが無効です",
      details: validationResult.error.flatten(),
    };
  }

  const { id, title, sourceInfo, imageUrl, ingredients, steps, tagIds } = validationResult.data;

  try {
    // ユーザー情報を取得
    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!dbUser) {
      return { error: "ユーザー情報が見つかりません" };
    }

    // レシピの所有者確認
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingRecipe) {
      return { error: "レシピが見つかりません" };
    }

    if (existingRecipe.userId !== dbUser.id) {
      return { error: "このレシピを編集する権限がありません" };
    }

    // トランザクションでレシピを更新
    const recipe = await prisma.$transaction(async (tx) => {
      // レシピ本体を更新
      const updatedRecipe = await tx.recipe.update({
        where: { id },
        data: {
          title,
          sourceInfo,
          imageUrl,
        },
      });

      // 材料を更新（既存を削除して新規作成）
      if (ingredients) {
        await tx.ingredient.deleteMany({
          where: { recipeId: id },
        });
        await tx.ingredient.createMany({
          data: ingredients.map((ingredient) => ({
            recipeId: id,
            name: ingredient.name,
            unit: ingredient.unit,
            orderIndex: ingredient.orderIndex,
            notes: ingredient.notes,
          })),
        });
      }

      // 手順を更新（既存を削除して新規作成）
      if (steps) {
        await tx.step.deleteMany({
          where: { recipeId: id },
        });
        await tx.step.createMany({
          data: steps.map((step) => ({
            recipeId: id,
            stepNumber: step.stepNumber,
            instruction: step.instruction,
            timerMinutes: step.timerMinutes,
          })),
        });
      }

      // タグを更新（既存を削除して新規作成）
      if (tagIds !== undefined) {
        await tx.recipeTag.deleteMany({
          where: { recipeId: id },
        });
        if (tagIds.length > 0) {
          await tx.recipeTag.createMany({
            data: tagIds.map((tagId) => ({
              recipeId: id,
              tagId,
            })),
          });
        }
      }

      // 更新されたレシピを取得
      return await tx.recipe.findUnique({
        where: { id },
        include: {
          ingredients: true,
          steps: {
            orderBy: {
              stepNumber: "asc",
            },
          },
          recipeTags: {
            include: {
              tag: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    });

    // キャッシュを再検証
    revalidatePath("/dashboard");
    revalidatePath(`/recipes/${id}`);

    return { success: true, recipe };
  } catch (error) {
    console.error("レシピ更新エラー:", error);
    return { error: "レシピの更新に失敗しました" };
  }
}

// レシピ削除
export async function deleteRecipe(id: string) {
  const supabase = await createClient();
  
  // ユーザー認証チェック
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "認証されていません" };
  }

  try {
    // ユーザー情報を取得
    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!dbUser) {
      return { error: "ユーザー情報が見つかりません" };
    }

    // レシピの所有者確認
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!recipe) {
      return { error: "レシピが見つかりません" };
    }

    if (recipe.userId !== dbUser.id) {
      return { error: "このレシピを削除する権限がありません" };
    }

    // カスケード削除（関連データも含めて削除）
    await prisma.$transaction(async (tx) => {
      // レシピタグを削除
      await tx.recipeTag.deleteMany({
        where: { recipeId: id },
      });

      // 材料を削除
      await tx.ingredient.deleteMany({
        where: { recipeId: id },
      });

      // 手順を削除
      await tx.step.deleteMany({
        where: { recipeId: id },
      });

      // OCR履歴を削除（存在する場合）
      await tx.ocrProcessingHistory.deleteMany({
        where: { recipeId: id },
      });

      // レシピバージョンを削除
      await tx.recipeVersion.deleteMany({
        where: { recipeId: id },
      });

      // レシピ本体を削除
      await tx.recipe.delete({
        where: { id },
      });
    });

    // キャッシュを再検証
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("レシピ削除エラー:", error);
    return { error: "レシピの削除に失敗しました" };
  }
}