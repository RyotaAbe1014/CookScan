import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const googleGemini2_5Flash = google('gemini-2.5-flash');
export const googleGemini3ProImagePreview = google('gemini-3-pro-image-preview');