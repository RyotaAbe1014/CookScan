import { createStep } from '@mastra/core/workflows';
import { z } from "zod";

export const convertTextToRecipeStep = createStep({
  id: 'convert-text-to-recipe',
  description: 'Convert text to recipe',
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
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgent('convertTextToRecipeAgent');
    if (!agent) {
      throw new Error('Convert text to recipe agent not found');
    }

    const response = await agent.generate([
      {
        role: 'user',
        content: inputData.text,
      },
    ], {
      structuredOutput: {
        schema: z.object({
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
        })
      },
      modelSettings: {
        temperature: 0,
        topP: 0.1,
      }
    });

    return response.object;
  },
});