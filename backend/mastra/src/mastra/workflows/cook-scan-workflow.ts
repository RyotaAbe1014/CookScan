import { createStep, createWorkflow } from "@mastra/core";
import { z } from "zod";

const imageToTextStep = createStep({
  id: 'image-to-text',
  description: 'Convert image to text',
  inputSchema: z.object({
    images: z
      .custom<FileList>()
      .refine((files) => 0 < files.length, {
        message: "画像ファイルの添付は必須です",
      })
      .refine((files) => 0 < files.length && files.length < 2, {
        message: "添付できる画像ファイルは1枚までです",
      })
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent('imageToTextAgent');
    if (!agent) {
      throw new Error('Image to text agent not found');
    }

    const response = await agent.generate([
      {
        role: 'user',
        content: [
          {
            type: 'file',
            data: await inputData.images[0].arrayBuffer(),
            mimeType: inputData.images[0].type,
          },
        ]
      },
    ], {
      temperature: 0,
    });

    return {
      text: response.text,
    };
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
    images: z
      .custom<FileList>()
      .refine((files) => 0 < files.length, {
        message: "画像ファイルの添付は必須です",
      })
      .refine((files) => 0 < files.length && files.length < 2, {
        message: "添付できる画像ファイルは1枚までです",
      })
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
