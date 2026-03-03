import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const OCR_PROMPT = `# 役割
あなたは、画像解析と文字認識（OCR）において最高レベルの精度を持つ専門家です。
画像内の全ての文字を、1文字も漏らさず、正確に書き起こしてください。

# 抽出のガイドライン
1. **完全性**: メインタイトル、ページ上部の英字、数字、写真の注釈まで全て抽出してください。
2. **順序と構造**:
   - 画像をブロックごとに認識し、上から下へ、左から右へ読み取ってください。
   - 2段組み（材料リストなど）の場合は、左列を読み切ってから右列へ進んでください。
   - 手順（1, 2, 3...）は、元の改行と番号を維持してください。
3. **視覚情報の処理**:
   - 写真の周辺にある小さな文字は、[画像注釈]として区別して記述してください。
4. **忠実性**:
   - 単位（ℓ, g, 小さじ1/2など）や記号を一切省略せず、画像通りに書き起こしてください。
   - 誤字に見えるものでも修正せず、見たままを出力してください。

# 追加指示（レイアウト定義）
- **最上部の英字・数字**: ヘッダー情報として最初に抽出してください。
- **最大サイズの日本語**: これを「メインタイトル」として認識してください。
- **枠囲みのテキスト**: キャッチコピーまたはサブタイトルとして抽出してください。

# 出力形式
- 余計な挨拶や説明は一切不要。テキストのみを直接出力してください。
- 判読不能な箇所は [?] と記載。`;

export async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const model = google('gemini-2.5-flash');

  const response = await generateText({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: model as any,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', image: imageBuffer },
          { type: 'text', text: OCR_PROMPT },
        ],
      },
    ],
    temperature: 0,
    topP: 0.1,
  });

  return response.text;
}
