import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from "zod";
import { convertTextToRecipeStep } from "./steps/convert-text-to-recipe";

const imageToTextStep = createStep({
  id: 'image-to-text',
  description: 'Convert image to text',
  inputSchema: z.object({
    images: z.array(z.custom<File>()),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    try {
      const texts = await Promise.all(inputData.images.map(async (image) => {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const agent = mastra.getAgent('imageToTextAgent');
        const response = await agent.generate([
          {
            role: 'user',
            content: [{ type: 'image', image: buffer, mediaType: image.type }],
          },
        ], {
          structuredOutput: {
            schema: z.object({
              text: z.string(),
            }),
          },
          modelSettings: {
            temperature: 0,
            topP: 0.1,
          }
        }
        );

        console.log(response.text);
        return response.text;
      }));
      return {
        text: texts.join('\n'),
      };
    } catch (error) {
      console.error('Error in image-to-text step:', error);
      throw new Error(`Failed to extract text from image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});
const cookScanWorkflow = createWorkflow({
  id: 'cook-scan-workflow',
  inputSchema: z.object({
    images: z.array(z.custom<File>()),
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
  .then(imageToTextStep)
  .then(convertTextToRecipeStep);

cookScanWorkflow.commit();

export { cookScanWorkflow };
