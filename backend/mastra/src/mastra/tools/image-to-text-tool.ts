import { createTool } from '@mastra/core/tools';
import { z } from 'zod';


export const imageToTextTool = createTool({
  id: 'image-to-text',
  description: 'Convert an image to text',
  inputSchema: z.object({
    images: z
      .custom<FileList>()
      .refine((files) => 0 < files.length, {
        message: "画像ファイルの添付は必須です",
      })
      .refine((files) => 0 < files.length && files.length < 2, {
        message: "添付できる画像ファイルは1枚までです",
      })
      .refine(
        (files) =>
          Array.from(files).every((file) => ['image/jpeg', 'image/png'].includes(file.type)),
        { message: "添付できる画像ファイルはjpegかpngです" },
      ),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
});
