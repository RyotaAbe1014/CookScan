
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { cookScanWorkflow } from './workflows/cook-scan-workflow';
import { imageToTextAgent } from './agents/image-to-text-agent';
import { convertTextToRecipeAgent } from './agents/convert-text-to-recipe-agent';
import { textToRecipeWorkflow } from './workflows/text-to-recipe';
import { recommendAlternativesAgent } from './agents/recommend-alternative-agent';
import { recommendAlternativesWorkflow } from './workflows/recommend-alternatives-workflow';

export const mastra = new Mastra({
  workflows: { cookScanWorkflow, textToRecipeWorkflow, recommendAlternativesWorkflow },
  agents: { imageToTextAgent, convertTextToRecipeAgent, recommendAlternativesAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
