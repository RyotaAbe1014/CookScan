# command

## 開発
```bash
npm run dev              # 開発サーバー起動
npm run build            # プロダクションビルド
npm run start            # プロダクションサーバー起動
```

## コード品質
```bash
npm run lint             # ESLintでコードチェック
npm run type-check       # TypeScriptの型チェック
```

## テスト
```bash
npm run test             # テスト実行（watch mode）
npm run test:run         # テスト実行（1回のみ）
npm run test:coverage    # カバレッジ付きテスト実行
npm run test:ui          # Vitest UIでテスト実行
```

## データベース
```bash
npm run db:generate      # Prisma Clientを生成
npm run db:format        # Prismaスキーマをフォーマット
npm run db:validate      # Prismaスキーマを検証
npm run db:status        # マイグレーション状態を確認
npm run db:migrate       # マイグレーションファイルを作成
npm run db:deploy        # マイグレーションを実行
npm run db:seed          # シードデータを投入
npm run db:studio        # Prisma Studioを起動
```

## Storybook
```bash
npm run storybook        # Storybookを起動
npm run storybook:build  # Storybookをビルド
```

# ドキュメント

## usecase doc
- @docs/usecase/

## er-diagram
- @docs/er-diagram.md

# セキュリティルール

## 環境変数とシークレット管理
1. `.env`ファイルは読まない - 環境変数の構造が必要な場合は、`.env.example`やREADME.mdを参照するか、ユーザーに質問します
2. 機密情報を記録しない - APIキー、パスワード、トークンなどの機密情報は、メモリやログに保存しません

# 完了の定義
完了の定義として以下を満たすようにしてください
- npm run lintで全てのコードチェックがパスすること
- npm run type-checkで全ての型チェックがパスすること
- npm run testで全てのテストがパスすること
- npm run buildでビルドが成功すること
