# CookScan デザインシステム

このドキュメントは、CookScanアプリケーションのデザインシステムを定義します。一貫性のあるUI/UXを実現するため、すべての開発者とデザイナーはこのガイドラインに従ってください。

## デザイン哲学

CookScanは **フレッシュで明るく、使いやすい** レシピ管理アプリケーションを目指しています。

### コアバリュー
- **シンプルさ**: 複雑な機能も直感的に操作できる
- **フレッシュさ**: 料理の楽しさを表現する明るいカラーパレット
- **アクセシビリティ**: すべてのユーザーが快適に使える設計
- **モダンさ**: フラットデザインを基調とした現代的なUI

---

## カラーパレット

### デザインコンセプト
**ミントグリーン系 + 単色ベース（フラットデザイン）**

料理の新鮮さとヘルシーさを表現するミントグリーンをメインカラーに採用。グラデーションは控えめに使用し、フラットでクリーンな印象を重視します。

### Primary Colors - Emerald（エメラルド）

メインアクション（ボタン、リンク等）に使用。

| 変数名 | カラーコード | Tailwind | 用途 |
|--------|-------------|----------|------|
| `--primary` | `#059669` | `emerald-600` | ボタン、リンク、アクティブ状態 |
| `--primary-hover` | `#047857` | `emerald-700` | ホバー時 |
| `--primary-light` | `#d1fae5` | `emerald-100` | 背景、薄い強調表示 |
| `--primary-foreground` | `#ffffff` | `white` | プライマリ上のテキスト |

**アクセシビリティ**: `emerald-600` + 白テキスト = コントラスト比 4.5:1（WCAG AA準拠）

### Secondary Colors - Teal（ティール）

補助的なアクション、セカンダリボタンに使用。

| 変数名 | カラーコード | Tailwind | 用途 |
|--------|-------------|----------|------|
| `--secondary` | `#14b8a6` | `teal-500` | セカンダリボタン |
| `--secondary-hover` | `#0d9488` | `teal-600` | ホバー時 |
| `--secondary-light` | `#ccfbf1` | `teal-100` | 背景 |
| `--secondary-foreground` | `#ffffff` | `white` | セカンダリ上のテキスト |

### Accent Colors - セクション別

各セクションを視覚的に区別するためのアクセントカラー。

#### Steps（調理手順）- Sky Blue
| 変数名 | カラーコード | Tailwind |
|--------|-------------|----------|
| `--accent-steps` | `#0ea5e9` | `sky-500` |
| `--accent-steps-light` | `#e0f2fe` | `sky-100` |
| `--accent-steps-foreground` | `#ffffff` | `white` |

#### Ingredients（材料）- Emerald
| 変数名 | カラーコード | Tailwind |
|--------|-------------|----------|
| `--accent-ingredients` | `#10b981` | `emerald-500` |
| `--accent-ingredients-light` | `#d1fae5` | `emerald-100` |
| `--accent-ingredients-foreground` | `#ffffff` | `white` |

#### Tags（タグ/ソース情報）- Amber
| 変数名 | カラーコード | Tailwind |
|--------|-------------|----------|
| `--accent-tags` | `#f59e0b` | `amber-500` |
| `--accent-tags-light` | `#fef3c7` | `amber-100` |
| `--accent-tags-foreground` | `#ffffff` | `white` |

### Status Colors

操作の結果やステータスを表現する色。

#### Success（成功）
| 変数名 | カラーコード | Tailwind |
|--------|-------------|----------|
| `--success` | `#22c55e` | `green-500` |
| `--success-light` | `#dcfce7` | `green-100` |
| `--success-foreground` | `#ffffff` | `white` |

#### Warning（警告）
| 変数名 | カラーコード | Tailwind |
|--------|-------------|----------|
| `--warning` | `#f59e0b` | `amber-500` |
| `--warning-light` | `#fef3c7` | `amber-100` |
| `--warning-foreground` | `#ffffff` | `white` |

#### Danger（エラー/削除）
| 変数名 | カラーコード | Tailwind |
|--------|-------------|----------|
| `--danger` | `#ef4444` | `red-500` |
| `--danger-hover` | `#dc2626` | `red-600` |
| `--danger-light` | `#fee2e2` | `red-100` |
| `--danger-foreground` | `#ffffff` | `white` |

### Neutral Colors

テキスト、ボーダー、背景等の基本要素。

| 変数名 | カラーコード | Tailwind | 用途 |
|--------|-------------|----------|------|
| `--background` | `#ffffff` | `white` | ページ背景 |
| `--foreground` | `#171717` | `neutral-900` | メインテキスト |
| `--muted` | `#f8fafc` | `slate-50` | 控えめな背景 |
| `--muted-foreground` | `#64748b` | `slate-500` | サブテキスト |
| `--border` | `#e2e8f0` | `slate-200` | ボーダー |
| `--border-dark` | `#cbd5e1` | `slate-300` | 濃いボーダー |

### Card / Surface Colors

カード、パネル等の表面要素。

| 変数名 | カラーコード | 用途 |
|--------|-------------|------|
| `--card` | `#ffffff` | カード背景 |
| `--card-foreground` | `#171717` | カードテキスト |
| `--card-border` | `rgba(17, 24, 39, 0.05)` | カードボーダー |

---

## タイポグラフィ

### フォントファミリー

| 用途 | フォント | CSS変数 |
|------|---------|---------|
| 本文・UI | Geist Sans | `var(--font-sans)` |
| コード | Geist Mono | `var(--font-mono)` |

### フォントサイズ

Tailwindのデフォルトスケールを使用:

| サイズ名 | px | rem | Tailwind | 用途 |
|---------|----|----|----------|------|
| xs | 12px | 0.75rem | `text-xs` | 補足テキスト |
| sm | 14px | 0.875rem | `text-sm` | 小さいテキスト |
| base | 16px | 1rem | `text-base` | 本文 |
| lg | 18px | 1.125rem | `text-lg` | 小見出し |
| xl | 20px | 1.25rem | `text-xl` | 見出し |
| 2xl | 24px | 1.5rem | `text-2xl` | ページタイトル |
| 3xl | 30px | 1.875rem | `text-3xl` | 大見出し |

### フォントウェイト

| ウェイト | 数値 | Tailwind | 用途 |
|---------|------|----------|------|
| Normal | 400 | `font-normal` | 本文 |
| Medium | 500 | `font-medium` | ラベル、ボタン |
| Semibold | 600 | `font-semibold` | 小見出し |
| Bold | 700 | `font-bold` | 見出し、強調 |

---

## スペーシング

### レイアウトスペーシング

| 変数名 | サイズ | 用途 |
|--------|-------|------|
| `--spacing-section` | 1.5rem (24px) | セクション間の余白 |
| `--spacing-card` | 1.5rem (24px) | カード内パディング |
| `--spacing-header` | 1rem (16px) | ヘッダーパディング |

### Tailwind スペーシングスケール

主に使用するサイズ:

| Tailwind | rem | px | 用途 |
|----------|-----|----|------|
| `space-2` | 0.5rem | 8px | アイコンとテキストの間 |
| `space-3` | 0.75rem | 12px | 要素間の小さい余白 |
| `space-4` | 1rem | 16px | 要素間の標準余白 |
| `space-6` | 1.5rem | 24px | セクション内の余白 |
| `space-8` | 2rem | 32px | セクション間の余白 |

---

## Border Radius

| 変数名 | サイズ | Tailwind | 用途 |
|--------|-------|----------|------|
| `--radius-sm` | 0.25rem (4px) | `rounded-sm` | Badge、小要素 |
| `--radius-md` | 0.375rem (6px) | `rounded-md` | Input、Select |
| `--radius-lg` | 0.5rem (8px) | `rounded-lg` | Button |
| `--radius-xl` | 0.75rem (12px) | `rounded-xl` | Card |
| `--radius-2xl` | 1rem (16px) | `rounded-2xl` | Modal |
| `--radius-full` | 9999px | `rounded-full` | 円形要素 |

---

## シャドウ

### 標準シャドウ

| 変数名 | Tailwind | 用途 |
|--------|----------|------|
| `--shadow-sm` | `shadow-sm` | 軽い浮き上がり |
| `--shadow-md` | `shadow-md` | 標準のCard |
| `--shadow-lg` | `shadow-lg` | ホバー時のCard |
| `--shadow-xl` | `shadow-xl` | Modal、Dropdown |

### カラーティントシャドウ

| 変数名 | 色 | 用途 |
|--------|---|------|
| `--shadow-primary` | emerald-600 | プライマリボタン |
| `--shadow-primary-hover` | emerald-600 | ホバー時 |
| `--shadow-danger` | red-500 | 削除ボタン |
| `--shadow-danger-hover` | red-500 | ホバー時 |
| `--shadow-card` | 無色 | Card標準シャドウ |

---

## トランジション

| 変数名 | 時間 | イージング | 用途 |
|--------|------|-----------|------|
| `--transition-fast` | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | ホバー、アクティブ状態 |
| `--transition-normal` | 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` | 標準アニメーション |
| `--transition-slow` | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | ページ遷移 |

---

## グラデーション使用ガイドライン

### 基本方針
**単色ベースのフラットデザインを重視**。グラデーションは控えめに使用します。

### 使用が許可される場所
1. **ページ背景**: 軽い2色グラデーション（emerald-50 → white → teal-50）
2. **装飾要素**: ヘッダーの軽いアクセント程度

### 使用を避ける場所
1. **ボタン**: 単色 + シャドウで表現
2. **カード**: 白背景 + シャドウで表現
3. **アイコン**: 単色またはSVGグラデーション

---

## コンポーネント使用ガイドライン

### Button

**バリアント:**
- `primary`: メインアクション（emerald-600）
- `secondary`: サブアクション（gray-300 背景）
- `ghost`: テキストボタン
- `danger`: 削除・エラーアクション（red-500）
- `danger-ghost`: 削除のゴーストボタン
- `link`: リンクスタイル

**サイズ:**
- `sm`: 小さいボタン
- `md`: 標準ボタン（デフォルト）
- `lg`: 大きいボタン
- `icon`: アイコンのみボタン

**使用例:**
```tsx
<Button variant="primary" size="md">保存</Button>
<Button variant="secondary">キャンセル</Button>
<Button variant="danger">削除</Button>
```

### Card

**構成:**
- `Card`: カードコンテナ
- `CardHeader`: ヘッダー（オプショナル）
- `CardContent`: コンテンツ部分

**CardHeader グラデーションバリアント:**
- `emerald`: エメラルドグラデーション
- `blue`: ブルーグラデーション
- `purple`: パープルグラデーション
- `amber`: アンバーグラデーション
- `rose`: ローズグラデーション
- `indigo`: インディゴグラデーション

**使用例:**
```tsx
<Card>
  <CardHeader gradient="emerald" icon={<TagIcon />}>
    タイトル
  </CardHeader>
  <CardContent>
    コンテンツ
  </CardContent>
</Card>
```

### Input / Textarea / Select

**バリアント:**
- `default`: 標準（グレーボーダー）
- `green`: 材料セクション用（emerald系）
- `blue`: 手順セクション用（sky系）

**サイズ:**
- `sm`: 小
- `md`: 標準（デフォルト）
- `lg`: 大
- `xl`: 特大（モバイル用）

### Alert

**バリアント:**
- `error`: エラーメッセージ（red-50背景）
- `success`: 成功メッセージ（green-50背景）
- `warning`: 警告メッセージ（yellow-50背景）
- `info`: 情報メッセージ（blue-50背景）

**使用例:**
```tsx
<Alert variant="success">保存しました</Alert>
<Alert variant="error">エラーが発生しました</Alert>
```

---

## レスポンシブデザイン

### ブレークポイント

| 名前 | 最小幅 | Tailwind | デバイス |
|------|-------|----------|---------|
| `sm` | 640px | `sm:` | タブレット |
| `md` | 768px | `md:` | 小型ラップトップ |
| `lg` | 1024px | `lg:` | デスクトップ |
| `xl` | 1280px | `xl:` | 大型デスクトップ |

### モバイルファースト

すべてのスタイルはモバイルから始め、大きい画面に対してメディアクエリを追加します。

```tsx
{/* モバイル: 1カラム、デスクトップ: 3カラム */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

### モバイル専用コンポーネント

`useIsMobile()` フックを使用して、モバイルとデスクトップで別コンポーネントを出し分け:

```tsx
const isMobile = useIsMobile()
return isMobile ? <ComponentMobile /> : <ComponentDesktop />
```

---

## アクセシビリティガイドライン

### コントラスト比

すべてのテキストと背景の組み合わせは **WCAG AA基準（4.5:1以上）** を満たす必要があります。

### フォーカス状態

すべてのインタラクティブ要素（ボタン、リンク、入力）は、キーボードフォーカス時に明確な視覚的フィードバックを提供します。

```tsx
{/* フォーカスリング */}
<button className="focus:ring-2 focus:ring-primary focus:ring-offset-2">
```

### ARIA属性

必要に応じてARIA属性を追加:
- `aria-label`: スクリーンリーダー用のラベル
- `aria-live`: 動的コンテンツの通知
- `role`: 要素の役割を明示

---

## ファイル構成

### CSS変数定義
**パス**: `/cook-scan/src/app/globals.css`

すべてのカラー、スペーシング、シャドウ等の変数はここで定義されます。

### UIコンポーネント
**パス**: `/cook-scan/src/components/ui/`

再利用可能なUIコンポーネントライブラリ。

### レイアウトコンポーネント
**パス**: `/cook-scan/src/components/layouts/`

ページレイアウト用のラッパーコンポーネント。

### アイコン
**パス**: `/cook-scan/src/components/icons/`

SVGアイコンコンポーネント。

---

## 更新履歴

### 2026-01-12: カラーパレット刷新
- **変更内容**: Indigo/Purple系 → Emerald/Teal系に変更
- **理由**: モダンで明るいデザインへの刷新
- **影響**: すべてのプライマリカラーとグラデーション使用箇所

---

## 参考リンク

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Geist Font](https://vercel.com/font)
