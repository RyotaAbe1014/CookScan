# CookScan

料理画像からレシピ情報を抽出するWebアプリケーションです。

## 技術スタック

- **フレームワーク**: Next.js 16.1.1 (App Router)
- **言語**: TypeScript
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **スタイリング**: Tailwind CSS v4
- **テスト**: Vitest

## セットアップ

### 前提条件

- Node.js 22+
- npm

### 環境設定

1. **リポジトリをクローン**
```bash
git clone [repository-url]
cd cook-scan
```

2. **依存関係をインストール**
```bash
npm install
```

3. **環境変数を設定**
`.env` ファイルを作成して以下を設定:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
DIRECT_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
OPENAI_API_KEY=YOUR_OPENAI_KEY
GOOGLE_API_KEY=YOUR_GOOGLE_KEY
```

4. **Prisma Clientを生成**
```bash
npm run db:generate
```

5. **マイグレーションを適用**
```bash
npm run db:migrate -- --create-only
```

6. **マイグレーションをデプロイ**
```bash
npm run db:deploy
```

6. **開発サーバーを起動**
```bash
npm run dev
```

アプリケーションは http://localhost:3000 で利用できます。

## 開発用コマンド

### アプリケーション
- `npm run dev` - 開発サーバー起動（.envを読み込み）
- `npm run build` - 本番ビルド（.envを読み込み）
- `npm run start` - 本番サーバー起動
- `npm run lint` - Lintチェック実行（src）

### テスト
- `npm run test` - Vitest起動
- `npm run test:run` - テストを1回実行
- `npm run test:coverage` - カバレッジ取得
- `npm run test:watch` - Watchモード
- `npm run test:ui` - Vitest UI

### データベース
- `npm run db:generate` - Prisma Client生成
- `npm run db:format` - スキーマ整形
- `npm run db:validate` - スキーマ検証
- `npm run db:status` - マイグレーション状態確認
- `npm run db:migrate` - マイグレーション適用
- `npm run db:seed` - シード投入
- `npm run db:studio` - Prisma Studioを開く

## プロジェクト構成

```
cook-scan/
├── prisma/           # Prismaスキーマ/マイグレーション
├── public/           # 静的ファイル
├── src/
│   └── app/         # Next.js App Router
└── package.json
```

## トラブルシューティング

### マイグレーションが失敗する
1. `.env` の接続情報が正しいか確認
2. `npm run db:status` で状態を確認
3. `npm run db:generate` でClientを再生成

### ビルドエラー
1. `npm run db:generate` でPrisma Clientを再生成
2. node_modulesを削除して再インストール
