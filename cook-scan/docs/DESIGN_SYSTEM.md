# CookScan デザインシステム

このドキュメントは、CookScanアプリケーション全体で使用されている統一されたデザインシステムのガイドラインです。

## 目次

1. [カラーパレット](#カラーパレット)
2. [グラデーション](#グラデーション)
3. [タイポグラフィ](#タイポグラフィ)
4. [スペーシング](#スペーシング)
5. [シャドウとエフェクト](#シャドウとエフェクト)
6. [ボタン](#ボタン)
7. [インプットフィールド](#インプットフィールド)
8. [カード](#カード)
9. [アイコンバッジ](#アイコンバッジ)
10. [アニメーション](#アニメーション)
11. [セクション別カラーコーディング](#セクション別カラーコーディング)

---

## カラーパレット

### プライマリカラー
- **Indigo-Purple**: メインアクション、ヘッダー、ナビゲーション
  - `indigo-50` ~ `indigo-600`
  - `purple-50` ~ `purple-600`

### セカンダリカラー（機能別）
- **Amber-Orange**: タグ、カテゴリ関連
  - `amber-50` ~ `amber-600`
  - `orange-50` ~ `orange-600`

- **Green-Emerald**: 材料、追加アクション
  - `green-50` ~ `green-600`
  - `emerald-50` ~ `emerald-600`

- **Blue-Indigo**: 手順、ステップ関連
  - `blue-50` ~ `blue-600`

- **Red-Orange**: 削除、警告、エラー
  - `red-50` ~ `red-600`

### グレースケール
- `gray-50` ~ `gray-900`: テキスト、ボーダー、背景

---

## グラデーション

### 背景グラデーション
```tsx
// ページ全体の背景
className="bg-gradient-to-br from-indigo-50 via-white to-purple-50"
```

### ボタングラデーション
```tsx
// プライマリボタン（Indigo-Purple）
className="bg-gradient-to-r from-indigo-600 to-purple-600"

// 削除ボタン（Red-Orange）
className="bg-gradient-to-r from-red-600 to-orange-600"

// タグ関連（Amber-Orange）
className="bg-gradient-to-r from-amber-600 to-orange-600"

// 材料関連（Green-Emerald）
className="bg-gradient-to-r from-green-500 to-emerald-600"

// 手順関連（Blue-Indigo）
className="bg-gradient-to-r from-blue-500 to-indigo-600"
```

### アイコンバッジグラデーション
```tsx
// 小さなアイコンバッジ
className="bg-gradient-to-br from-{color}-500 to-{color}-600"
```

### テキストグラデーション
```tsx
// 見出しグラデーション
className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
```

---

## タイポグラフィ

### 見出し
```tsx
// メインタイトル（h1）
className="text-3xl font-bold text-gray-900"

// セクションタイトル（h2）
className="text-xl font-bold text-gray-900"

// サブセクションタイトル（h3）
className="text-lg font-semibold text-gray-900"
```

### ラベル
```tsx
// フォームラベル
className="text-sm font-semibold text-gray-700"

// 補足テキスト
className="text-sm text-gray-600"
```

### 本文
```tsx
// 通常テキスト
className="text-base text-gray-900"

// 説明文
className="text-sm leading-relaxed text-gray-600"
```

---

## スペーシング

### コンテナパディング
```tsx
// カード内部
className="p-6"  // または p-8 for larger cards

// セクション
className="space-y-6"  // 垂直スペース

// フォームフィールド間
className="space-y-4"
```

### マージン
```tsx
// セクション間
className="mt-8"

// 要素間
className="gap-3" または "gap-4"
```

---

## シャドウとエフェクト

### カードシャドウ
```tsx
// 通常のカード
className="shadow-lg ring-1 ring-gray-900/5"

// より強調されたカード
className="shadow-xl ring-1 ring-gray-900/5"
```

### ボタンシャドウ
```tsx
// プライマリボタン
className="shadow-lg shadow-indigo-500/30"

// ホバー時
className="hover:shadow-xl hover:shadow-indigo-500/40"
```

### グラスモーフィズム（Glassmorphism）
```tsx
// モーダル背景
className="backdrop-blur-sm"

// 装飾要素
className="backdrop-blur-lg bg-white/50"
```

### リング（フォーカス）
```tsx
// インプットフォーカス
className="focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
```

---

## ボタン

### プライマリボタン
```tsx
<button
  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
>
  <svg className="h-5 w-5">...</svg>
  ボタンテキスト
</button>
```

### セカンダリボタン（アウトライン）
```tsx
<button
  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
>
  <svg className="h-4 w-4">...</svg>
  ボタンテキスト
</button>
```

### 危険なアクション（削除）
```tsx
<button
  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/40"
>
  <svg className="h-4 w-4">...</svg>
  削除
</button>
```

### ローディング状態
```tsx
{isPending ? (
  <span className="flex items-center justify-center gap-2">
    <svg className="h-5 w-5 animate-spin">
      {/* スピナーSVG */}
    </svg>
    処理中...
  </span>
) : (
  <span className="flex items-center justify-center gap-2">
    <svg className="h-5 w-5">...</svg>
    通常テキスト
  </span>
)}
```

---

## インプットフィールド

### テキストインプット
```tsx
<div>
  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
    <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-purple-600">
      <svg className="h-3 w-3 text-white">...</svg>
    </div>
    ラベル
  </label>
  <div className="relative">
    <input
      type="text"
      className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
    />
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <svg className="h-5 w-5 text-gray-400">...</svg>
    </div>
  </div>
</div>
```

### テキストエリア
```tsx
<textarea
  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
  rows={3}
/>
```

### セレクト
```tsx
<select
  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
>
  <option>選択してください</option>
</select>
```

### 無効化状態
```tsx
<input
  disabled
  className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-500 shadow-sm"
/>
```

---

## カード

### 基本カード
```tsx
<div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
  {/* コンテンツ */}
</div>
```

### セクション付きカード
```tsx
<div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
  {/* ヘッダー */}
  <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
        <svg className="h-5 w-5 text-white">...</svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900">セクションタイトル</h2>
    </div>
  </div>

  {/* コンテンツ */}
  <div className="p-6">
    {/* 内容 */}
  </div>
</div>
```

### ホバー可能なカード
```tsx
<div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 transition-all hover:-translate-y-1 hover:shadow-xl">
  {/* 装飾 */}
  <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-50 transition-transform group-hover:scale-110" />

  {/* コンテンツ */}
</div>
```

---

## アイコンバッジ

### 小サイズ（ラベル用）
```tsx
<div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-indigo-500 to-purple-600">
  <svg className="h-3 w-3 text-white">...</svg>
</div>
```

### 中サイズ（セクションヘッダー用）
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
  <svg className="h-5 w-5 text-white">...</svg>
</div>
```

### 大サイズ（ページヘッダー用）
```tsx
<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30">
  <svg className="h-10 w-10 text-white">...</svg>
</div>
```

---

## アニメーション

### トランジション
```tsx
// 基本トランジション
className="transition-all"

// カスタムデュレーション
className="transition-all duration-300"
```

### ホバーエフェクト
```tsx
// 上昇エフェクト
className="hover:-translate-y-1"

// スケールアップ
className="hover:scale-110"

// シャドウ強調
className="hover:shadow-xl"
```

### スピナー（ローディング）
```tsx
<svg className="h-5 w-5 animate-spin">
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="4"
  />
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  />
</svg>
```

---

## セクション別カラーコーディング

アプリケーション全体で一貫性を保つため、各セクションには特定のカラースキームを使用します。

### レシピ基本情報
- **カラー**: Indigo → Purple
- **使用箇所**: タイトル、メモ、画像、ソース情報

```tsx
className="bg-gradient-to-br from-indigo-500 to-purple-600"
```

### タグ・カテゴリ
- **カラー**: Amber → Orange
- **使用箇所**: タグ選択、カテゴリ管理

```tsx
className="bg-gradient-to-br from-amber-500 to-orange-600"
```

### 材料
- **カラー**: Green → Emerald
- **使用箇所**: 材料リスト、材料追加

```tsx
className="bg-gradient-to-br from-green-500 to-emerald-600"
```

### 手順
- **カラー**: Blue → Indigo
- **使用箇所**: 調理手順、ステップ番号

```tsx
className="bg-gradient-to-br from-blue-500 to-indigo-600"
```

### 削除・警告
- **カラー**: Red → Orange
- **使用箇所**: 削除ボタン、エラーメッセージ

```tsx
className="bg-gradient-to-br from-red-500 to-orange-600"
```

---

## レスポンシブデザイン

### ブレークポイント
```tsx
// モバイル: デフォルト
// タブレット: sm: (640px)
// デスクトップ: md: (768px), lg: (1024px)

className="p-4 sm:p-6 lg:p-8"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## アクセシビリティ

### フォーカス状態
```tsx
// インタラクティブ要素には必ずフォーカス状態を追加
className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
```

### ディスエーブル状態
```tsx
// 無効化時の明確な視覚的フィードバック
className="disabled:cursor-not-allowed disabled:opacity-50"
```

### セマンティックHTML
```tsx
// 適切なHTML要素を使用
<button type="button">...</button>
<label htmlFor="input-id">...</label>
<input id="input-id" />
```

---

## まとめ

このデザインシステムは、CookScanアプリケーション全体で一貫性のある美しいUIを実現するためのガイドラインです。新しいコンポーネントを作成する際は、このドキュメントを参照して、既存のパターンに従ってください。

### 重要なポイント
1. **一貫性**: 同じ機能には同じカラースキームを使用
2. **グラデーション**: 視覚的な深みを追加するために積極的に活用
3. **アイコン**: すべてのセクションとアクションにアイコンを追加
4. **アニメーション**: 適度なホバーエフェクトとトランジション
5. **アクセシビリティ**: フォーカス状態とセマンティックHTMLを常に意識

デザインシステムの更新や追加が必要な場合は、このドキュメントを更新してチーム全体で共有してください。
