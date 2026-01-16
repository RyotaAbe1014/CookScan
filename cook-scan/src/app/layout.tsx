import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CookScan - AIレシピ抽出アプリ",
    template: "%s | CookScan",
  },
  description:
    "AIを使用して画像からレシピを抽出・管理。スクリーンショット、写真、手書きメモからレシピ情報を自動で構造化データに変換します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="apple-mobile-web-app-title" content="CookScan" />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
