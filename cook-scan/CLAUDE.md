# プロジェクト概要
個人使用のためのレシピ読み取りサービス

# ドキュメント
## ユースケース
- @docs/usecase/
## ER図
- @docs/er-diagram.md

# コマンド

## 開発
```bash
npm run build            # ビルド
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
```

# セキュリティルール

## 環境変数とシークレット管理
1. `.env`ファイルは読まない - 環境変数の構造が必要な場合は、`.env.example`やREADME.mdを参照するか、ユーザーに質問します
2. 機密情報を記録しない - APIキー、パスワード、トークンなどの機密情報は、メモリやログに保存しません
