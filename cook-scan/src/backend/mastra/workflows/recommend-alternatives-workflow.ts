import { createWorkflow } from '@mastra/core/workflows';
import { createStep } from '@mastra/core/workflows';
import { z } from "zod";



const recommendAlternativesStep = createStep({
  id: 'recommend-alternatives',
  description: 'Recommend alternatives',
  inputSchema: z.object({
    user_input: z.string(),
    recipe_text: z.string(),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgent('recommendAlternativesAgent');
    if (!agent) {
      throw new Error('Recommend alternatives agent not found');
    }

    const response = await agent.generate([
      {
        role: 'user',
        content: inputData.user_input,
      },
    ], {
      structuredOutput: {
        schema: z.object({
          text: z.string(),
        })
      }
    });

    return response.object;
  },
});

const recommendAlternativesWorkflow = createWorkflow({
  id: 'recommend-alternatives-workflow',
  inputSchema: z.object({
    user_input: z.string(),
    recipe_text: z.string(),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
}).then(recommendAlternativesStep)

recommendAlternativesWorkflow.commit();

export { recommendAlternativesWorkflow };
