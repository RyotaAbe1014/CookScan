import { createTool } from '@mastra/core/tools';
import { z } from 'zod';


export const imageToTextTool = createTool({
  id: 'image-to-text',
  description: 'Convert an image to text',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
  // execute: async ({ context }) => {
  //   return;
  // },
});
