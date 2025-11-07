import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { db, ensureDatabase } from '../db/database';
import type { Recipe, RecipeWithoutMeta } from '../types/recipe';

const recipes = new Hono();

// GET /api/recipes - 全レシピの一覧取得
recipes.get('/', async (c) => {
  await ensureDatabase();
  return c.json({
    success: true,
    recipes: db.data?.recipes || []
  });
});

// GET /api/recipes/:id - 特定のレシピ取得
recipes.get('/:id', async (c) => {
  await ensureDatabase();
  const id = c.req.param('id');
  
  const recipe = db.data?.recipes.find(r => r.id === id);
  
  if (!recipe) {
    return c.json({
      success: false,
      error: 'Recipe not found'
    }, 404);
  }
  
  return c.json({
    success: true,
    recipe
  });
});

// POST /api/recipes - 新規レシピの保存
recipes.post('/', async (c) => {
  await ensureDatabase();
  
  try {
    const body = await c.req.json<RecipeWithoutMeta>();
    
    if (!body.title || !body.ingredients || !body.steps) {
      return c.json({
        success: false,
        error: 'Missing required fields: title, ingredients, steps'
      }, 400);
    }
    
    const now = new Date().toISOString();
    const newRecipe: Recipe = {
      id: uuidv4(),
      ...body,
      createdAt: now,
      updatedAt: now
    };
    
    db.data?.recipes.push(newRecipe);
    await db.write();
    
    return c.json({
      success: true,
      recipe: newRecipe
    }, 201);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request body'
    }, 400);
  }
});

// PUT /api/recipes/:id - レシピの更新
recipes.put('/:id', async (c) => {
  await ensureDatabase();
  const id = c.req.param('id');
  
  try {
    const body = await c.req.json<Partial<RecipeWithoutMeta>>();
    
    const recipeIndex = db.data?.recipes.findIndex(r => r.id === id);
    
    if (recipeIndex === undefined || recipeIndex === -1) {
      return c.json({
        success: false,
        error: 'Recipe not found'
      }, 404);
    }
    
    const updatedRecipe: Recipe = {
      ...db.data!.recipes[recipeIndex],
      ...body,
      id: db.data!.recipes[recipeIndex].id,
      createdAt: db.data!.recipes[recipeIndex].createdAt,
      updatedAt: new Date().toISOString()
    };
    
    db.data!.recipes[recipeIndex] = updatedRecipe;
    await db.write();
    
    return c.json({
      success: true,
      recipe: updatedRecipe
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request body'
    }, 400);
  }
});

// DELETE /api/recipes/:id - レシピの削除
recipes.delete('/:id', async (c) => {
  await ensureDatabase();
  const id = c.req.param('id');
  
  const recipeIndex = db.data?.recipes.findIndex(r => r.id === id);
  
  if (recipeIndex === undefined || recipeIndex === -1) {
    return c.json({
      success: false,
      error: 'Recipe not found'
    }, 404);
  }
  
  db.data!.recipes.splice(recipeIndex, 1);
  await db.write();
  
  return c.json({
    success: true,
    message: 'Recipe deleted successfully'
  });
});

export default recipes;