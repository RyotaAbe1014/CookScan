import { createWorkflow } from "@mastra/core";
import { z } from "zod";
import { convertTextToRecipeStep } from "./steps/convert-text-to-recipe";

const textToRecipeWorkflow = createWorkflow({
  id: 'text-to-recipe-workflow',
  inputSchema: z.object({
    text: z.string(),
  }),
  outputSchema: z.object({
    title: z.string(),
    ingredients: z.array(z.object({
      name: z.string(),
      unit: z.string(),
    })),
    steps: z.array(z.object({
      instruction: z.string(),
      timerSeconds: z.number().nullable(),
    })),
    memo: z.string().nullable(),
  }),
})
  .then(convertTextToRecipeStep);

textToRecipeWorkflow.commit();

export { textToRecipeWorkflow };
