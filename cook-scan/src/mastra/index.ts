
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { cookScanWorkflow } from './src/mastra/workflows/cook-scan-workflow';
import { imageToTextAgent } from './src/mastra/agents/image-to-text-agent';
import { convertTextToRecipeAgent } from './src/mastra/agents/convert-text-to-recipe-agent';

export const mastra = new Mastra({
  workflows: { cookScanWorkflow },
  agents: { imageToTextAgent, convertTextToRecipeAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
