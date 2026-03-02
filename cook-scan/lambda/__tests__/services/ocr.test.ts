import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: vi.fn(() => vi.fn(() => 'mock-model')),
}));

vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

vi.stubEnv('GOOGLE_API_KEY', 'test-api-key');

import { extractTextFromImage } from '../../src/services/ocr.js';
import { generateText } from 'ai';

const mockGenerateText = vi.mocked(generateText);

describe('ocr service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('画像バッファからテキストを抽出する', async () => {
    mockGenerateText.mockResolvedValue({
      text: '抽出されたテキスト',
    } as never);

    const result = await extractTextFromImage(Buffer.from('fake-image'));

    expect(result).toBe('抽出されたテキスト');
    expect(mockGenerateText).toHaveBeenCalledWith(
      expect.objectContaining({
        temperature: 0,
        topP: 0.1,
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            content: expect.arrayContaining([
              expect.objectContaining({ type: 'image' }),
              expect.objectContaining({ type: 'text' }),
            ]),
          }),
        ]),
      }),
    );
  });

  it('APIエラーがそのまま伝播する', async () => {
    mockGenerateText.mockRejectedValue(new Error('API rate limit'));

    await expect(extractTextFromImage(Buffer.from('fake'))).rejects.toThrow('API rate limit');
  });
});
