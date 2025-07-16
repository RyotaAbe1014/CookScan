import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const convertTextToRecipeTool = createTool({
  id: 'convert-text-to-recipe',
  description: 'Convert text to recipe',
  inputSchema: z.object({
    text: z.string(),
  }),
  outputSchema: z.object({
    title: z.string(),
    ingredients: z.array(z.object({
      name: z.string(),
      quantity: z.string(),
    })),
    steps: z.array(z.string()),
    memo: z.string().optional(),
  }),
});
