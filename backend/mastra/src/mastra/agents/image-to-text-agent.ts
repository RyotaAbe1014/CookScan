import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools/weather-tool';
import { googleGemini25Flash } from '../models/google';

export const imageToTextAgent = new Agent({
  name: 'Image to Text Agent',
  instructions: `
`,
  model: googleGemini25Flash,
  tools: { weatherTool },
});
