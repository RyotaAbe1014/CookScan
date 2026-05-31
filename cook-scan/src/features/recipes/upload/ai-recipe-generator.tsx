"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { RecipeFormTagCategory } from "@/features/recipes/types/tag";
import { AiRecipeDraftForm, type AiRecipeDraft } from "./ai-recipe-draft-form";
import { ReferenceRecipePicker, type ReferenceRecipe } from "./reference-recipe-picker";
import { DocumentTextIcon } from "@/components/icons/document-text-icon";
import { LightningBoltIcon } from "@/components/icons/lightning-bolt-icon";
import { BookOpenIcon } from "@/components/icons/book-open-icon";
import { CloseIcon } from "@/components/icons/close-icon";

type GenerateRecipeResponse =
  | {
      status: "success";
      result: {
        message: string;
        intent: "chat" | "recipe_draft";
        recipeDraft: AiRecipeDraft | null;
        suggestions: string[];
        // 新規参照レシピを送ったときだけ、サーバーが整形したレシピ全文が返る。
        // クライアントはこれを会話履歴に焼き込み、以降は再送しない。
        referenceContext: string | null;
      };
    }
  | {
      status: "error";
      error: string;
    };

const minChars = 5;
const initialAssistantMessage =
  "冷蔵庫にある食材や、作りたい雰囲気を教えてください。条件があれば一緒に書くと、レシピの下書きまで作れます。";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  context?: string;
};

type Props = {
  tagCategories: RecipeFormTagCategory[];
};

export function AiRecipeGenerator({ tagCategories }: Props) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recipeDraft, setRecipeDraft] = useState<AiRecipeDraft | null>(null);
  const [recipeDraftVersion, setRecipeDraftVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // 参照レシピはセッション中保持される。レシピ全文は「新しく加わったターン」だけ
  // 送信し、サーバーが返す整形テキストを会話履歴に焼き込むことで再送を避ける。
  const [referenceRecipes, setReferenceRecipes] = useState<ReferenceRecipe[]>([]);
  const [injectedReferenceIds, setInjectedReferenceIds] = useState<Set<string>>(new Set());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (error) setError(null);
  };

  const formatRecipeDraftForContext = (draft: AiRecipeDraft) => {
    const ingredients = draft.ingredients
      .map((ingredient) => {
        const notes = ingredient.notes ? ` (${ingredient.notes})` : "";
        return `- ${ingredient.name}: ${ingredient.unit}${notes}`;
      })
      .join("\n");
    const steps = draft.steps
      .map((step, index) => {
        const timer = step.timerSeconds ? ` (${step.timerSeconds}秒)` : "";
        return `${index + 1}. ${step.instruction}${timer}`;
      })
      .join("\n");

    return [
      "レシピ下書き:",
      `タイトル: ${draft.title}`,
      "材料:",
      ingredients,
      "手順:",
      steps,
      `メモ: ${draft.memo ?? "なし"}`,
    ].join("\n");
  };

  const buildRequestMessages = (nextMessages: ChatMessage[]) =>
    nextMessages.map((message) => ({
      role: message.role,
      content: message.context ? `${message.content}\n\n${message.context}` : message.content,
    }));

  const sendMessage = async (content: string) => {
    const trimmedPrompt = content.trim();

    if (!trimmedPrompt) {
      setError("希望や食材を入力してください");
      return;
    }

    if (trimmedPrompt.length < minChars) {
      setError(`${minChars}文字以上入力してください`);
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmedPrompt }];
    const userMessageIndex = nextMessages.length - 1;

    // まだ会話履歴に焼き込んでいない参照レシピだけを送る（重複注入を避ける）。
    const newReferenceIds = referenceRecipes
      .filter((recipe) => !injectedReferenceIds.has(recipe.id))
      .map((recipe) => recipe.id);

    setError(null);
    setIsLoading(true);
    setSuggestions([]);
    setMessages(nextMessages);
    setPrompt("");

    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: buildRequestMessages(nextMessages),
          ...(newReferenceIds.length > 0 && {
            referenceRecipeIds: newReferenceIds,
          }),
        }),
      });
      const data: GenerateRecipeResponse = await response.json().catch(() => ({
        status: "error" as const,
        error: "レシピ生成に失敗しました",
      }));

      if (data.status === "success") {
        const draftContext =
          data.result.intent === "recipe_draft" && data.result.recipeDraft
            ? formatRecipeDraftForContext(data.result.recipeDraft)
            : undefined;
        const referenceContext = data.result.referenceContext;
        setMessages((currentMessages) => {
          // 新規参照レシピが解決された場合、その全文を直前のuserメッセージへ焼き込む。
          // 以降のターンでは履歴として送られるため、レシピIDの再送が不要になる。
          const withReference = referenceContext
            ? currentMessages.map((message, index) =>
                index === userMessageIndex
                  ? {
                      ...message,
                      context: message.context
                        ? `${message.context}\n\n${referenceContext}`
                        : referenceContext,
                    }
                  : message,
              )
            : currentMessages;
          return [
            ...withReference,
            { role: "assistant", content: data.result.message, context: draftContext },
          ];
        });
        if (newReferenceIds.length > 0 && referenceContext) {
          setInjectedReferenceIds(
            (current) => new Set([...current, ...newReferenceIds]),
          );
        }
        setSuggestions(data.result.suggestions);
        if (data.result.intent === "recipe_draft" && data.result.recipeDraft) {
          setRecipeDraft(data.result.recipeDraft);
          setRecipeDraftVersion((currentVersion) => currentVersion + 1);
        }
      } else {
        setError(data.error);
      }
    } catch (e) {
      console.error(e);
      setError("レシピ生成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    await sendMessage(prompt);
  };

  const removeReferenceRecipe = (id: string) => {
    setReferenceRecipes((current) => current.filter((recipe) => recipe.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isLoading && prompt.trim()) {
        void sendMessage(prompt);
      }
    }
  };

  const hasRecipeDraft = recipeDraft !== null;
  const canSubmit = !isLoading && prompt.trim().length > 0;

  return (
    <div
      className={
        hasRecipeDraft
          ? "mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]"
          : "mx-auto max-w-5xl"
      }
    >
      <div>
        <div className="ring-card-border flex min-h-[calc(100vh-220px)] flex-col overflow-hidden rounded-xl bg-white shadow-lg ring-1">
          <div className="border-border from-section-header border-b bg-linear-to-r to-white px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="from-accent-ingredients to-accent-steps flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br">
                  <DocumentTextIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-foreground text-base font-bold">AIで献立・レシピ提案</h2>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    食材や希望を送ると、会話しながらレシピ下書きまで作れます
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 p-6">
            <div className="border-border bg-muted/20 min-h-[320px] flex-1 space-y-4 overflow-y-auto rounded-lg border p-4">
              <div className="flex justify-start">
                <div className="text-foreground ring-border max-w-[85%] rounded-xl bg-white px-4 py-3 text-sm leading-7 whitespace-pre-wrap shadow-sm ring-1">
                  {initialAssistantMessage}
                </div>
              </div>
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-7 whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground ring-border bg-white shadow-sm ring-1"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isLoading}
                onClick={() => setIsPickerOpen(true)}
              >
                <BookOpenIcon className="h-4 w-4" />
                レシピを参照
              </Button>
              {referenceRecipes.map((recipe) => (
                <span
                  key={recipe.id}
                  className="bg-primary/10 text-primary ring-primary/20 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1"
                >
                  {recipe.title}
                  <button
                    type="button"
                    aria-label={`${recipe.title}を参照から外す`}
                    onClick={() => removeReferenceRecipe(recipe.id)}
                    className="hover:text-primary-hover"
                    disabled={isLoading}
                  >
                    <CloseIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <Textarea
                value={prompt}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="例：鶏むね肉、玉ねぎ、卵があります。20分くらいで作れる夕飯にしたいです。"
                rows={2}
                className="min-h-[64px] flex-1 resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                isLoading={isLoading}
                size="lg"
                className="self-end"
              >
                {!isLoading && <LightningBoltIcon className="h-5 w-5" />}
                {isLoading ? "考え中..." : messages.length === 0 ? "レシピを提案" : "送信"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {recipeDraft && (
        <div className="max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
          <div className="mb-6">
            <h2 className="text-foreground text-xl font-bold">レシピ下書き</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              AIが作成した下書きを確認・編集してから保存できます
            </p>
          </div>
          <AiRecipeDraftForm
            key={recipeDraftVersion}
            draft={recipeDraft}
            tagCategories={tagCategories}
            onCancel={() => setRecipeDraft(null)}
          />
        </div>
      )}

      <ReferenceRecipePicker
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selected={referenceRecipes}
        onConfirm={setReferenceRecipes}
      />
    </div>
  );
}
