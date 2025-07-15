# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code)向けのガイダンスを提供します。

## プロジェクト概要

CookScanは、AI を使用して画像（スクリーンショット、写真、手書きメモ）を構造化されたレシピデータに変換する日本語レシピ抽出アプリケーションです。プロジェクトは3つの主要コンポーネントを持つモノレポとして構成されています：

- **フロントエンド** (`/frontend/`) - React+Vite アプリケーション（TypeScript）
- **バックエンド** (`/backend/`) - Hono API サーバー（AWS Lambda デプロイメント）
- **Mastra AI** (`/backend/mastra/`) - レシピ処理用 AI ワークフローフレームワーク

## 開発コマンド

### フロントエンド開発
```bash
cd frontend
npm run dev      # 開発サーバー起動 (ポート 5173)
npm run build    # 本番用ビルド
npm run lint     # ESLint 実行
npm run preview  # 本番ビルドのプレビュー
```

### バックエンド開発
```bash
cd backend
npm run dev      # 開発サーバー起動 (ポート 3001)
npm run build    # esbuild でバンドル
npm run deploy   # AWS Lambda 完全デプロイメントパイプライン
```

### AI フレームワーク (Mastra)
```bash
cd backend/mastra
npm run dev      # Mastra 開発サーバー起動
npm run build    # Mastra アプリケーションビルド
npm run start    # 本番サーバー起動
```

## アーキテクチャ

### フロントエンドアーキテクチャ
- **React 19** と TypeScript、Vite による高速開発
- **コンポーネント構造**: API ヘルスチェック統合を含む基本的なアプリ構造
- **API 通信**: ポート 3001 のバックエンドへの接続を設定
- **ビルドプロセス**: TypeScript コンパイル + Vite バンドリング

### バックエンドアーキテクチャ
- **Hono フレームワーク**: サーバーレス向けに最適化された高速Webフレームワーク
- **CORS 設定**: フロントエンド通信用に有効化（ポート 5173）
- **AWS Lambda 対応**: Lambda 関数用のデプロイメントスクリプト設定済み
- **API エンドポイント**: `/api/health` でヘルスチェックエンドポイント

### AI 統合 (Mastra)
- **OpenAI 統合**: テキスト処理用 GPT-4o-mini
- **データベース**: データストレージ用 LibSQL（SQLite 互換）
- **スキーマ検証**: 型安全なデータ検証用 Zod
- **ツールアーキテクチャ**: AI 操作用の拡張可能なワークフローシステム

## レシピ処理ワークフロー（計画中）

アプリケーションは以下のワークフローに従います：
1. **画像アップロード**: ユーザーが画像ファイルをドラッグ＆ドロップ
2. **OCR 処理**: Gemini 2.5 Pro が画像からテキストを抽出
3. **AI 解析**: GPT-4o がテキストを構造化されたレシピ JSON に変換
4. **プレビュー＆編集**: ユーザーが抽出されたデータを確認・修正
5. **保存**: レシピデータをローカル SQLite データベースに保存

## コード構成

### フロントエンド (`/frontend/`)
- `src/App.tsx` - メインアプリケーションコンポーネント
- `src/main.tsx` - アプリケーションエントリーポイント
- `vite.config.ts` - Vite 設定
- `tsconfig.json` - TypeScript 設定

### バックエンド (`/backend/`)
- `src/index.ts` - CORS 付き Hono サーバー設定
- `esbuild.config.js` - ビルド設定
- `deploy.sh` - AWS Lambda デプロイメントスクリプト

### Mastra (`/backend/mastra/`)
- `src/index.ts` - Mastra アプリケーションエントリーポイント
- `src/tools/` - AI ワークフローツール
- `src/workflows/` - AI 処理ワークフロー
- `drizzle.config.ts` - データベース設定

## 重要な注意事項

### 技術スタック
- **フロントエンド**: React 19, TypeScript, Vite, ESLint
- **バックエンド**: Hono, Node.js, esbuild, AWS Lambda
- **AI**: Mastra フレームワーク, OpenAI GPT-4o-mini, LibSQL
- **言語**: プロジェクトは日本語テキスト処理をサポート

### 開発環境
- Node.js 20.9.0+ が必要
- すべてのプロジェクトでロックファイル付きの npm を使用
- 全体で ESM モジュール
- 開発時にホットモジュールリプレースメントが有効

### テスト
現在、テストフレームワークは設定されていません。テストを実装する際は以下を検討してください：
- フロントエンド: Vitest（Vite と良好に統合）
- バックエンド: Node.js テストフレームワーク
- AI ワークフロー: Mastra ツール用ユニットテスト

### 一般的な開発タスク
- 完全な開発開始: `/frontend/` と `/backend/` ディレクトリで `npm run dev` を実行
- フロントエンドルートでバックエンド接続テストが利用可能
- AWS デプロイメントには適切な Lambda 関数設定が必要
- Mastra ワークフローには OpenAI API キー設定が必要

### プロジェクトステータス
これは基本的なインフラストラクチャが整った初期段階のプロジェクトです。コアとなるレシピ抽出機能はまだ実装されていません - 現在の Mastra 設定には、レシピ処理ワークフローに置き換える必要がある天気ワークフローの例が含まれています。