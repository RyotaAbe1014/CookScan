# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code)へのガイダンスを提供します。

## プロジェクト概要

CookScanは、画像（スクリーンショット、写真、手書きメモ）からレシピ情報を抽出し、構造化されたJSONデータに変換するWebアプリケーションです。OCRとLLM技術を使用してレシピデータを解析・構造化します。

## 開発コマンド

### バックエンド（backend/）
```bash
# 開発サーバー起動（ポート3001）
npm run dev

# ビルド（AWS Lambda用）
npm run build

# AWSへのデプロイ
npm run deploy
```

### フロントエンド（frontend/）
```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# リント
npm run lint
```

### Mastra AIワークフロー（backend/mastra/）
```bash
# 開発
npm run dev

# ビルド
npm run build

# 起動
npm run start
```

## アーキテクチャ

### 技術スタック
- **フロントエンド**: React + TypeScript + Vite + Material-UI
- **バックエンド**: Node.js + Hono（軽量Webフレームワーク）
- **データベース**: lowdb（JSONベースのローカルDB）
- **AI/ML**: 
  - 画像処理: Google Gemini 2.5 Flash（OCR/テキスト抽出）
  - テキスト処理: OpenAI GPT-4o（レシピ構造化）
  - ワークフロー: Mastraフレームワーク

### 主要なディレクトリ構造
- `backend/src/`: バックエンドのメインコード
  - `routes/`: APIエンドポイント定義
  - `db/`: データベース設定
  - `types/`: TypeScript型定義
- `backend/mastra/src/mastra/`: AIワークフロー実装
  - `agents/`: テキスト/画像処理エージェント
  - `workflows/`: レシピ抽出ワークフロー
- `frontend/src/`: フロントエンドコード
  - `api/`: バックエンドAPIクライアント
  - `components/`: Reactコンポーネント

### APIエンドポイント
- `POST /api/recipes/extract`: 画像からレシピを抽出（保存オプション付き）
- `GET /api/recipes`: 全レシピ一覧
- `GET /api/recipes/:id`: 特定のレシピ取得
- `PUT /api/recipes/:id`: レシピ更新
- `DELETE /api/recipes/:id`: レシピ削除

### データモデル
```typescript
interface Recipe {
  id: string;
  title: string;
  ingredients: Array<{
    name: string;
    quantity: string;
  }>;
  steps: string[];
  memo?: string;
  createdAt: string;
  updatedAt: string;
}
```

## 開発時の注意点

1. **環境変数**: AIモデルのAPIキー（OPENAI_API_KEY、GOOGLE_GENERATIVE_AI_API_KEY）が必要
2. **ポート**: バックエンドは3001番ポートで起動
3. **画像制限**: アップロード可能な画像は10MBまで、JPEG/PNG/WebP形式
4. **データベース**: `backend/db.json`にレシピデータが保存される
5. **AWS Lambda**: バックエンドはLambda対応でビルド・デプロイ可能