import { PasswordSetupForm } from "@/features/profile/password/password-setup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "パスワード設定 | CookScan",
  description: "パスワードを設定してアカウントのセキュリティを保護します",
};

export default function PasswordSetupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <PasswordSetupForm />
    </div>
  );
}
