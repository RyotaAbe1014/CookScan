import { createStep, createWorkflow } from "@mastra/core";
import { z } from "zod";
import { generateText } from "ai";
import { googleGemini25Flash } from "../models/google";

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
        model: googleGemini25Flash,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'この画像からすべてのテキストを抽出してください。',
              },
              {
                type: 'file',
                data: buffer,
                mimeType: inputData.image.type,
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

const convertTextToRecipeStep = createStep({
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
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('convertTextToRecipeAgent');
    if (!agent) {
      throw new Error('Convert text to recipe agent not found');
    }

    const response = await agent.generate([
      {
        role: 'user',
        content: inputData.text,
      },
    ], {
      output: z.object({
        title: z.string(),
        ingredients: z.array(z.object({
          name: z.string(),
          quantity: z.string(),
        })),
        steps: z.array(z.string()),
        memo: z.string().optional(),
      })
    });

    return response.object;
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
      quantity: z.string(),
    })),
    steps: z.array(z.string()),
    memo: z.string().optional(),
  }),
})
  .then(imageToTextStep)
  .then(convertTextToRecipeStep);

cookScanWorkflow.commit();

export { cookScanWorkflow };
