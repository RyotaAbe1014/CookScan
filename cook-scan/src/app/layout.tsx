import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CookScan - AIレシピ抽出アプリ",
    template: "%s | CookScan",
  },
  description:
    "AIを使用して画像からレシピを抽出・管理。スクリーンショット、写真、手書きメモからレシピ情報を自動で構造化データに変換します。",
  keywords: ["レシピ", "AI", "OCR", "料理", "レシピ管理", "画像認識"],
  authors: [{ name: "CookScan" }],
  openGraph: {
    title: "CookScan - AIレシピ抽出アプリ",
    description:
      "AIを使用して画像からレシピを抽出・管理。スクリーンショット、写真、手書きメモからレシピ情報を自動で構造化データに変換します。",
    type: "website",
    locale: "ja_JP",
    siteName: "CookScan",
  },
  twitter: {
    card: "summary_large_image",
    title: "CookScan - AIレシピ抽出アプリ",
    description:
      "AIを使用して画像からレシピを抽出・管理。スクリーンショット、写真、手書きメモからレシピ情報を自動で構造化データに変換します。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
