"use client";

import { useTransition } from "react";
import { logout } from "./actions";
import { Button } from "@/components/ui/button";
import { LogoutIcon } from "@/components/icons/logout-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Button
      variant="secondary"
      size="md"
      onClick={handleLogout}
      disabled={isPending}
      className="hover:border-danger-light hover:bg-danger-light hover:text-danger transition-all duration-200 hover:shadow-sm"
      aria-label="ログアウト"
    >
      {isPending ? (
        <>
          <SpinnerIcon className="text-muted-foreground h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">ログアウト中...</span>
        </>
      ) : (
        <>
          <LogoutIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          <span className="hidden sm:inline">ログアウト</span>
        </>
      )}
    </Button>
  );
}
