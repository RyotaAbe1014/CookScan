"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { RecipeFormTagCategory } from "@/features/recipes/types/tag";
import { AiRecipeDraftForm, type AiRecipeDraft } from "./ai-recipe-draft-form";
import { DocumentTextIcon } from "@/components/icons/document-text-icon";
import { LightningBoltIcon } from "@/components/icons/lightning-bolt-icon";

type GenerateRecipeResponse =
  | {
      status: "success";
      result: {
        message: string;
        intent: "chat" | "recipe_draft";
        recipeDraft: AiRecipeDraft | null;
      };
    }
  | {
      status: "error";
      error: string;
    };

const minChars = 5;
const suggestionPrompts = ["もっと時短にして", "買い足しなしで作りたい", "子供向けにして"];
const initialAssistantMessage =
  "冷蔵庫にある食材や、作りたい雰囲気を教えてください。条件があれば一緒に書くと、レシピの下書きまで作れます。";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  tagCategories: RecipeFormTagCategory[];
};

export function AiRecipeGenerator({ tagCategories }: Props) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recipeDraft, setRecipeDraft] = useState<AiRecipeDraft | null>(null);
  const [recipeDraftVersion, setRecipeDraftVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (error) setError(null);
  };

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

    setError(null);
    setIsLoading(true);
    setMessages(nextMessages);
    setPrompt("");

    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data: GenerateRecipeResponse = await response.json().catch(() => ({
        status: "error" as const,
        error: "レシピ生成に失敗しました",
      }));

      if (data.status === "success") {
        setMessages((currentMessages) => [
          ...currentMessages,
          { role: "assistant", content: data.result.message },
        ]);
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

  const hasRecipeDraft = recipeDraft !== null;

  return (
    <div
      className={
        hasRecipeDraft
          ? "mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]"
          : "mx-auto max-w-3xl"
      }
    >
      <div>
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="from-accent-ingredients to-accent-steps flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br shadow-md">
              <LightningBoltIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-foreground text-xl font-bold">AIで献立・レシピ提案</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            最初に食材や希望を入力し、そのあと追加の要望でレシピを調整できます
          </p>
        </div>

        <div className="ring-card-border overflow-hidden rounded-xl bg-white shadow-lg ring-1">
          <div className="border-border from-section-header border-b bg-linear-to-r to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="from-accent-ingredients to-accent-steps flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br">
                <DocumentTextIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-foreground text-sm font-semibold">AIレシピチャット</span>
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div className="border-border bg-muted/20 max-h-[520px] min-h-[260px] space-y-4 overflow-y-auto rounded-lg border p-4">
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

            <Textarea
              value={prompt}
              onChange={handleChange}
              placeholder="例：鶏むね肉、玉ねぎ、卵があります。20分くらいで作れる夕飯にしたいです。"
              rows={3}
              className="min-h-[96px] resize-y"
              disabled={isLoading}
            />

            {error && <Alert variant="error">{error}</Alert>}

            {messages.some((message) => message.role === "assistant") && (
              <div className="flex flex-wrap gap-2">
                {suggestionPrompts.map((suggestion) => (
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

            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isLoading} isLoading={isLoading} size="lg">
                {!isLoading && <LightningBoltIcon className="h-5 w-5" />}
                {isLoading ? "考え中..." : messages.length === 0 ? "レシピを提案" : "送信"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {recipeDraft && (
        <div>
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
    </div>
  );
}
