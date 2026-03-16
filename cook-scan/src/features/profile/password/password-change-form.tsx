"use client";

import { useState, useTransition } from "react";
import { updatePassword, type PasswordChangeFormData } from "./actions";
import { isSuccess } from "@/utils/result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { LockIcon } from "@/components/icons/lock-icon";
import { KeyIcon } from "@/components/icons/key-icon";
import { ShieldCheckIcon } from "@/components/icons/shield-check-icon";
import { CheckCircleOutlineIcon } from "@/components/icons/check-circle-outline-icon";

export function PasswordChangeForm() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<PasswordChangeFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updatePassword(formData);
      // 成功時は自動的に /login にリダイレクトされるため、失敗時のみエラーを設定
      if (!isSuccess(result)) {
        setError(result.error.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      {/* エラー表示 */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* 現在のパスワード - slate系（認証用） */}
      <div className="space-y-2">
        <label
          htmlFor="currentPassword"
          className="text-foreground flex items-center gap-2 text-sm font-medium"
        >
          <div className="bg-muted-foreground flex h-5 w-5 items-center justify-center rounded">
            <LockIcon className="h-3 w-3 text-white" />
          </div>
          現在のパスワード
          <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            type="password"
            id="currentPassword"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            placeholder="現在のパスワードを入力"
            disabled={isPending}
            required
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <KeyIcon className="text-muted-foreground h-5 w-5" />
          </div>
        </div>
        <p className="text-muted-foreground text-xs">本人確認のため、現在のパスワードが必要です</p>
      </div>

      {/* 新しいパスワード - emerald系（新規設定） */}
      <div className="space-y-2">
        <label
          htmlFor="newPassword"
          className="text-foreground flex items-center gap-2 text-sm font-medium"
        >
          <div className="bg-primary flex h-5 w-5 items-center justify-center rounded">
            <LockIcon className="h-3 w-3 text-white" />
          </div>
          新しいパスワード
          <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            type="password"
            id="newPassword"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            placeholder="8文字以上、大文字・小文字・数字を含む"
            disabled={isPending}
            required
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <ShieldCheckIcon className="text-primary h-5 w-5" />
          </div>
        </div>
        <div className="bg-primary-light rounded-md p-3">
          <p className="text-primary-hover text-xs">
            <strong>セキュリティ要件:</strong>{" "}
            パスワードは8文字以上で、大文字、小文字、数字を含める必要があります
          </p>
        </div>
      </div>

      {/* パスワード確認 - teal系（確認用） */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-foreground flex items-center gap-2 text-sm font-medium"
        >
          <div className="bg-secondary flex h-5 w-5 items-center justify-center rounded">
            <CheckCircleOutlineIcon className="h-3 w-3 text-white" />
          </div>
          新しいパスワード（確認）
          <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="もう一度入力してください"
            disabled={isPending}
            required
            size="xl"
            hasIcon
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <CheckCircleOutlineIcon className="text-secondary h-5 w-5" />
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          入力ミスを防ぐため、もう一度入力してください
        </p>
      </div>

      {/* セキュリティ警告 - amber warning */}
      <Alert variant="warning">
        <strong>重要:</strong>{" "}
        パスワード変更後、すべてのデバイスから自動的にログアウトされます。新しいパスワードで再度ログインしてください。
      </Alert>

      {/* ボタン */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          disabled={isPending}
          className="w-full shadow-md transition-shadow hover:shadow-lg"
        >
          {isPending ? (
            "パスワードを変更中..."
          ) : (
            <>
              <CheckCircleOutlineIcon className="h-5 w-5" />
              パスワードを変更
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => window.history.back()}
          disabled={isPending}
          className="w-full"
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}
