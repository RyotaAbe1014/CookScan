"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "@/components/icons/search-icon";
import { CloseIcon } from "@/components/icons/close-icon";
import { DocumentSearchIcon } from "@/components/icons/document-search-icon";

type Props = {
  resultCount?: number;
};

export function RecipeSearch({ resultCount }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(currentQuery);
  const [prevCurrentQuery, setPrevCurrentQuery] = useState(currentQuery);
  const [isFocused, setIsFocused] = useState(false);

  // URLのクエリパラメータが外部から変わったらローカルstateを同期
  if (prevCurrentQuery !== currentQuery) {
    setPrevCurrentQuery(currentQuery);
    setQuery(currentQuery);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    const params = new URLSearchParams(searchParams.toString());

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    } else {
      params.delete("q");
    }

    router.push(`/recipes?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/recipes?${params.toString()}`);
  };

  const hasActiveSearch = currentQuery.length > 0;

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="relative">
        <div
          className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 transition-all duration-300 ${
            isFocused
              ? "ring-primary shadow-primary/20 shadow-xl ring-2"
              : "ring-card-border hover:shadow-xl"
          } `}
        >
          {/* Animated gradient background on focus */}
          <div
            className={`from-primary-light via-secondary-light to-accent-steps-light absolute inset-0 bg-linear-to-r opacity-0 transition-opacity duration-500 ${isFocused ? "opacity-100" : "group-hover:opacity-50"} `}
          />

          <div className="relative flex items-center gap-3 p-4">
            {/* Search Icon */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                isFocused
                  ? "bg-primary shadow-primary/40 scale-110 shadow-lg"
                  : "from-muted to-section-header-border bg-linear-to-br"
              } `}
            >
              <SearchIcon
                className={`h-5 w-5 transition-colors duration-300 ${isFocused ? "text-white" : "text-muted-foreground"}`}
              />
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="レシピ名で検索..."
              className="text-foreground placeholder-muted-foreground flex-1 bg-transparent text-base font-medium outline-none"
            />

            {/* Clear Button */}
            {hasActiveSearch && (
              <button
                type="button"
                onClick={handleClear}
                className="group/clear bg-muted hover:bg-danger-light flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all hover:scale-110"
                aria-label="検索をクリア"
              >
                <CloseIcon className="text-muted-foreground group-hover/clear:text-danger-hover h-4 w-4 transition-colors" />
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              disabled={query.trim().length === 0}
              className="group/btn bg-primary shadow-primary/30 hover:shadow-primary/40 relative flex h-11 w-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto sm:px-6"
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />

              <SearchIcon className="relative h-4 w-4 transition-transform group-hover/btn:scale-110" />
              <span className="relative hidden sm:inline">検索</span>
            </button>
          </div>
        </div>
      </form>

      {/* Search Results Count */}
      {hasActiveSearch && typeof resultCount === "number" && (
        <div className="mt-3 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-md">
              <DocumentSearchIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-foreground text-sm font-medium">
              検索結果: <span className="text-primary font-bold">{resultCount}</span>件
              {currentQuery && (
                <span className="text-muted-foreground ml-2">
                  「<span className="text-foreground font-semibold">{currentQuery}</span>」
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
