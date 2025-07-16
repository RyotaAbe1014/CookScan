import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools/weather-tool';

export const convertTextToRecipeAgent = new Agent({
  name: 'Convert Text to Recipe Agent',
  instructions: `

`,
  model: openai('gpt-4o'),
  tools: { weatherTool },
});
