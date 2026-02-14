import { Agent } from '@mastra/core/agent';
import { openaiGpt4oMini } from '../models/openai';

export const recommendAlternativesAgent = new Agent({
  id: 'recommend-alternativess-agent',
  name: 'Recommend Alternatives Agent',
  // TODO: Add instructions
  instructions: `

`,
  model: openaiGpt4oMini,
});
