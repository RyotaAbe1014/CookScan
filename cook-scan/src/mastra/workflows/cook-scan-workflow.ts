import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from "zod";
import { generateText } from "ai";
import { openaiGpt4oMini } from "../models/openai";
import { convertTextToRecipeStep } from "./steps/convert-text-to-recipe";

const imageToTextStep = createStep({
  id: 'image-to-text',
  description: 'Convert image to text',
  inputSchema: z.object({
    image: z.custom<File>(),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
  execute: async ({ inputData }) => {
    try {
      const arrayBuffer = await inputData.image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const response = await generateText({
        model: openaiGpt4oMini,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'この画像からすべてのテキストを抽出してください。',
              },
              {
                type: 'image',
                image: buffer,
                mediaType: inputData.image.type,
              }
            ]
          }
        ],
        temperature: 0.0,
      });

      return {
        text: response.text,
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
    image: z.custom<File>(),
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
