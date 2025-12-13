# CookScan デザインシステム

このドキュメントは、CookScanアプリケーション全体で使用されている統一されたデザインシステムのガイドラインです。

## 技術スタック

このプロジェクトは**Tailwind CSS v4**を使用しています。

### Tailwind CSS v4の主な変更点

#### グラデーション文法
Tailwind v4では、グラデーション関連のクラス名が変更されました：

```tsx
// ✅ Tailwind v4推奨（新しい文法）
className="bg-linear-to-r from-indigo-600 to-purple-600"
className="bg-linear-to-br from-green-500 to-emerald-600"

// ⚠️ 従来の文法（動作するが非推奨）
className="bg-gradient-to-r from-indigo-600 to-purple-600"
className="bg-gradient-to-br from-green-500 to-emerald-600"
```

**注意**: このドキュメント内のコード例では、一部で従来の`bg-gradient-*`文法を使用していますが、新規コンポーネントでは`bg-linear-*`文法を推奨します。既存のコンポーネントは段階的に移行予定です。

### マイグレーション方針

- **新規コンポーネント**: `bg-linear-*`文法を使用
- **既存コンポーネント**: 当面は`bg-gradient-*`のまま動作、将来的に段階的移行
- **どちらも動作**: 両方の文法が現在動作しますが、v4推奨は`bg-linear-*`

---

## 目次

1. [カラーパレット](#カラーパレット)
2. [グラデーション](#グラデーション)
3. [タイポグラフィ](#タイポグラフィ)
4. [スペーシング](#スペーシング)
5. [シャドウとエフェクト](#シャドウとエフェクト)
6. [ボタン](#ボタン)
7. [インプットフィールド](#インプットフィールド)
8. [バリデーション状態パターン](#バリデーション状態パターン)
9. [文字数カウンターバッジ](#文字数カウンターバッジ)
10. [ヘルプ/ヒント情報ボックス](#ヘルプヒント情報ボックス)
11. [インラインバリデーションヘルパー](#インラインバリデーションヘルパー)
12. [カード](#カード)
13. [複数要素カードヘッダー](#複数要素カードヘッダー)
14. [アイコンバッジ](#アイコンバッジ)
15. [アニメーション](#アニメーション)
16. [セクション別カラーコーディング](#セクション別カラーコーディング)

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

### リッチTextareaプレースホルダー
```tsx
<textarea
  className="block w-full min-h-[300px] resize-y rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
  placeholder="レシピのテキストをここに貼り付けてください&#10;&#10;例：&#10;材料（2人分）&#10;- 鶏もも肉 300g&#10;- 玉ねぎ 1個&#10;&#10;作り方&#10;1. 鶏肉を一口大に切る&#10;2. フライパンで焼く..."
  rows={12}
/>
```

**ポイント**:
- `&#10;` を使用してプレースホルダー内で改行
- `min-h-[300px]` で最小高さを設定
- `resize-y` で縦方向のリサイズを許可
- 使用例を含めることでユーザーの入力を促進

---

## バリデーション状態パターン

フォーム入力やステータス表示で使用するバリデーション状態のパターンです。

### 成功状態（緑）
```tsx
// バッジスタイル
<div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
  <span>成功</span>
</div>

// テキストスタイル
<p className="text-sm text-green-600">成功メッセージ</p>
```

### 警告状態（アンバー）
```tsx
// バッジスタイル
<div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
  <span>警告</span>
</div>

// テキストスタイル
<p className="text-sm text-amber-600">警告メッセージ</p>
```

### エラー状態（赤）
```tsx
// バッジスタイル
<div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
  <span>エラー</span>
</div>

// テキストスタイル
<p className="text-sm text-red-600">エラーメッセージ</p>
```

---

## 文字数カウンターバッジ

テキスト入力フィールドでバリデーション状態を表示する動的なバッジです。

### 基本パターン
```tsx
const charCount = text.length
const minChars = 20
const isValid = charCount >= minChars

<div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-all ${
  isValid
    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
    : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
}`}>
  <span>{charCount}文字</span>
  {isValid ? (
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  )}
</div>
```

### カードヘッダー内での使用
```tsx
<div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
        <svg className="h-4 w-4 text-white">...</svg>
      </div>
      <span className="text-sm font-semibold text-gray-700">レシピテキスト</span>
    </div>
    {charCount > 0 && (
      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-all ${
        isValid
          ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
          : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
      }`}>
        <span>{charCount}文字</span>
        {/* アイコン */}
      </div>
    )}
  </div>
</div>
```

**ポイント**:
- 条件付きレンダリングで文字数が0の時は非表示
- `transition-all` でスムーズな状態変化
- アイコンで視覚的にバリデーション状態を明示

---

## ヘルプ/ヒント情報ボックス

ユーザーに追加情報やヒントを提供するための情報ボックスです。

### 基本パターン（Indigo-Purple）
```tsx
<div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-4 ring-1 ring-indigo-100">
  <div className="flex gap-3">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-indigo-900">ヒント</h4>
      <p className="mt-1 text-sm leading-relaxed text-indigo-700">
        材料リストと調理手順が含まれたテキストを貼り付けてください。
        書籍のレシピ、Webサイトからコピーしたテキスト、手書きメモの内容など、どんな形式でも構いません。
      </p>
    </div>
  </div>
</div>
```

### カラーバリエーション
```tsx
// 成功（Green）
className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 ring-1 ring-green-100"
// テキスト: text-green-600, text-green-700, text-green-900

// 警告（Amber）
className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-4 ring-1 ring-amber-100"
// テキスト: text-amber-600, text-amber-700, text-amber-900

// エラー（Red）
className="rounded-lg bg-gradient-to-r from-red-50 to-orange-50 p-4 ring-1 ring-red-100"
// テキスト: text-red-600, text-red-700, text-red-900
```

**ポイント**:
- グラデーション背景で視覚的な深みを追加
- アイコンは左側に固定（`flex-shrink-0`）
- 見出しと本文を分離して構造化
- `leading-relaxed` で読みやすい行間

---

## インラインバリデーションヘルパー

入力フィールドの直下に表示される、バリデーション状態に応じたヘルパーテキストです。

### 警告メッセージ
```tsx
{!isValid && charCount > 0 && (
  <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    あと{minChars - charCount}文字入力してください
  </p>
)}
```

### エラーメッセージ
```tsx
{error && (
  <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    {error}
  </p>
)}
```

### 成功メッセージ
```tsx
{isValid && (
  <p className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    入力内容は正しいです
  </p>
)}
```

**ポイント**:
- `mt-2` で入力フィールドから適切な間隔
- アイコンとテキストを`flex`で水平配置
- 条件付きレンダリングで必要な時のみ表示
- 小さめのフォント（`text-xs`）で補助的な情報として表示

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

## 複数要素カードヘッダー

カードヘッダー内に複数の要素（アイコン、ラベル、バッジなど）を配置するパターンです。

### 基本パターン（左右2カラム）
```tsx
<div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5">
  {/* ヘッダー */}
  <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
    <div className="flex items-center justify-between">
      {/* 左側: アイコン + ラベル */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
          <svg className="h-4 w-4 text-white">...</svg>
        </div>
        <span className="text-sm font-semibold text-gray-700">レシピテキスト</span>
      </div>

      {/* 右側: ステータスバッジ */}
      <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
        <svg className="h-3.5 w-3.5">...</svg>
        <span>100文字</span>
      </div>
    </div>
  </div>

  {/* カードボディ */}
  <div className="p-6">
    {/* コンテンツ */}
  </div>
</div>
```

### 条件付きバッジ表示
```tsx
<div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
        <svg className="h-4 w-4 text-white">...</svg>
      </div>
      <span className="text-sm font-semibold text-gray-700">ラベル</span>
    </div>

    {/* 条件付きレンダリング */}
    {showBadge && (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
        <span>バッジ内容</span>
      </div>
    )}
  </div>
</div>
```

### カラーバリエーション

ヘッダーアイコンバッジのカラーは、セクションの種類に応じて変更：

```tsx
// レシピ基本情報（Indigo-Purple）
className="bg-gradient-to-br from-indigo-500 to-purple-600"

// タグ・カテゴリ（Amber-Orange）
className="bg-gradient-to-br from-amber-500 to-orange-600"

// 材料（Green-Emerald）
className="bg-gradient-to-br from-green-500 to-emerald-600"

// 手順（Blue-Indigo）
className="bg-gradient-to-br from-blue-500 to-indigo-600"
```

**ポイント**:
- `justify-between` で左右に要素を配置
- 小さめのアイコンバッジ（h-8 w-8）でコンパクトに
- グラデーション背景で統一感を演出
- 条件付きレンダリングで柔軟な表示制御

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
1. **Tailwind CSS v4**: 新規コンポーネントでは`bg-linear-*`文法を推奨（従来の`bg-gradient-*`も動作）
2. **一貫性**: 同じ機能には同じカラースキームを使用
3. **グラデーション**: 視覚的な深みを追加するために積極的に活用
4. **アイコン**: すべてのセクションとアクションにアイコンを追加
5. **バリデーション状態**: 成功（緑）、警告（アンバー）、エラー（赤）の3状態を統一的に使用
6. **動的フィードバック**: 文字数カウンター、インラインヘルパーなどで即座にフィードバックを提供
7. **情報提供**: ヘルプ/ヒントボックスでユーザーをガイド
8. **アニメーション**: 適度なホバーエフェクトとトランジションで滑らかな体験を提供
9. **アクセシビリティ**: フォーカス状態とセマンティックHTMLを常に意識

### 新規追加パターン（2025年1月）

このバージョンで以下の新しいパターンが追加されました：

- **バリデーション状態パターン**: フォーム入力やステータス表示の統一的なバリデーションUI
- **文字数カウンターバッジ**: テキスト入力フィールドでのリアルタイムバリデーション表示
- **ヘルプ/ヒント情報ボックス**: グラデーション背景を使用した情報提供UI
- **インラインバリデーションヘルパー**: 入力フィールド直下の状態別ヘルパーテキスト
- **複数要素カードヘッダー**: 左右に異なる要素を配置した高度なカードヘッダーレイアウト
- **リッチTextareaプレースホルダー**: 複数行の使用例を含むプレースホルダー

これらのパターンは`src/features/recipes/upload/text-input.tsx`での実装を基に文書化されました。

デザインシステムの更新や追加が必要な場合は、このドキュメントを更新してチーム全体で共有してください。
