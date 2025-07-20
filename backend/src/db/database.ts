import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { DatabaseSchema } from '../types/recipe.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '../../db.json');

const adapter = new JSONFile<DatabaseSchema>(file);
const defaultData: DatabaseSchema = { recipes: [] };
export const db = new Low<DatabaseSchema>(adapter, defaultData);

export async function initDatabase() {
  await db.read();

  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }
}

export async function ensureDatabase() {
  if (!db.data) {
    await initDatabase();
  }
}
