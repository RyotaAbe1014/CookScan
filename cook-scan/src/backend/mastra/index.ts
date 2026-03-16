import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { PostgresStore } from "@mastra/pg";
import { convertTextToRecipeAgent } from "./agents/convert-text-to-recipe-agent";
import { textToRecipeWorkflow } from "./workflows/text-to-recipe";

const storage = new PostgresStore({
  id: "pg-storage",
  connectionString: process.env.DATABASE_URL,
  schemaName: "mastra",
  max: 3,
  idleTimeoutMillis: 30000,
});

export const mastra = new Mastra({
  workflows: { textToRecipeWorkflow },
  agents: { convertTextToRecipeAgent },
  storage: storage,
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
