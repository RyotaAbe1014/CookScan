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
- pnpm

### 環境設定

1. **リポジトリをクローン**
```bash
git clone [repository-url]
cd cook-scan
```

2. **依存関係をインストール**
```bash
pnpm install
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
pnpm run db:generate
```

5. **マイグレーションを適用**
```bash
pnpm run db:migrate -- --create-only
```

6. **マイグレーションをデプロイ**
```bash
pnpm run db:deploy
```

6. **開発サーバーを起動**
```bash
pnpm run dev
```

アプリケーションは http://localhost:3000 で利用できます。

## 開発用コマンド

### アプリケーション
- `pnpm run dev` - 開発サーバー起動（.envを読み込み）
- `pnpm run build` - 本番ビルド（.envを読み込み）
- `pnpm run start` - 本番サーバー起動
- `pnpm run lint` - Lintチェック実行（src）

### テスト
- `pnpm run test` - Vitest起動
- `pnpm run test:run` - テストを1回実行
- `pnpm run test:coverage` - カバレッジ取得
- `pnpm run test:watch` - Watchモード
- `pnpm run test:ui` - Vitest UI

### データベース
- `pnpm run db:generate` - Prisma Client生成
- `pnpm run db:format` - スキーマ整形
- `pnpm run db:validate` - スキーマ検証
- `pnpm run db:status` - マイグレーション状態確認
- `pnpm run db:migrate` - マイグレーション適用
- `pnpm run db:seed` - シード投入
- `pnpm run db:studio` - Prisma Studioを開く

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
2. `pnpm run db:status` で状態を確認
3. `pnpm run db:generate` でClientを再生成

### ビルドエラー
1. `pnpm run db:generate` でPrisma Clientを再生成
2. node_modulesを削除して再インストール
