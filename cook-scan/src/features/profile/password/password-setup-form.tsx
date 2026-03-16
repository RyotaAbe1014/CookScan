"use client";

import { useState, useTransition, type FormEvent } from "react";
import { setupPassword, type PasswordSetupFormData } from "./actions";
import { isSuccess } from "@/utils/result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { CheckIcon } from "@/components/icons/check-icon";
import { ShieldCheckIcon } from "@/components/icons/shield-check-icon";
import { CheckCircleOutlineIcon } from "@/components/icons/check-circle-outline-icon";

export const PasswordSetupForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData: PasswordSetupFormData = {
      password,
      confirmPassword,
    };

    startTransition(async () => {
      const result = await setupPassword(formData);

      if (!isSuccess(result)) {
        setError(result.error.message);
      }
      // 成功時は setupPassword 内で redirect される
    });
  };

  return (
    <div className="mx-auto w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <div className="bg-primary-light mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <ShieldCheckIcon className="text-primary h-8 w-8" />
        </div>
        <h1 className="text-foreground mb-2 text-2xl font-bold">パスワードを設定</h1>
        <p className="text-muted-foreground text-sm">
          アカウントのセキュリティを保護するため、パスワードを設定してください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* エラーメッセージ */}
        {error && <Alert variant="error">{error}</Alert>}

        {/* パスワード - emerald系（新規パスワード） */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-foreground flex items-center gap-2 text-sm font-medium"
          >
            <div className="bg-primary flex h-5 w-5 items-center justify-center rounded">
              <ShieldCheckIcon className="h-3 w-3 text-white" />
            </div>
            新しいパスワード
            <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="8文字以上、大文字・小文字・数字を含む"
              size="xl"
              disabled={isPending}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="もう一度入力してください"
              size="xl"
              disabled={isPending}
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

        {/* 送信ボタン */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPending || !password || !confirmPassword}
          isLoading={isPending}
          className="w-full shadow-md transition-shadow hover:shadow-lg"
        >
          {isPending ? (
            "設定中..."
          ) : (
            <>
              <CheckIcon className="h-5 w-5" />
              パスワードを設定
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
