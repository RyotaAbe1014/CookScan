import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const openaiGpt = openai('gpt-5-mini-2025-08-07');
export const openaiGpt4oMini = openai('gpt-4o-mini');
