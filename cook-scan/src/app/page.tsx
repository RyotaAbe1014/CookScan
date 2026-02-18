import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "CookScan - AIレシピ抽出アプリ",
  description: "写真からレシピを自動抽出。料理本やWebレシピを簡単にデジタル管理",
};

export default function Home() {
  redirect("/dashboard");
}
