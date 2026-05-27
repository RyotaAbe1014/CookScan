import { describe, it, expect, vi } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MethodSelector from "../method-selector";

describe("MethodSelector", () => {
  it("正常系：「画像からスキャン」ボタンが表示される", () => {
    // Given: MethodSelectorコンポーネントが表示されている
    const onSelect = vi.fn();
    render(<MethodSelector onSelect={onSelect} />);

    // Then: 「画像からスキャン」ボタンが表示される
    expect(screen.getByRole("button", { name: /画像からスキャン/ })).toBeInTheDocument();
  });

  it("正常系：「AIで献立・レシピ提案」ボタンが表示される", () => {
    // Given: MethodSelectorコンポーネントが表示されている
    const onSelect = vi.fn();
    render(<MethodSelector onSelect={onSelect} />);

    // Then: 「AIで献立・レシピ提案」ボタンが表示される
    expect(screen.getByRole("button", { name: /AIで献立・レシピ提案/ })).toBeInTheDocument();
  });

  it("正常系：スキャンボタンをクリックするとonSelectが呼ばれる", async () => {
    // Given: MethodSelectorコンポーネントが表示されている
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<MethodSelector onSelect={onSelect} />);

    // When: ユーザーが「画像からスキャン」ボタンをクリックする
    const scanButton = screen.getByRole("button", { name: /画像からスキャン/ });
    await user.click(scanButton);

    // Then: onSelectが'scan'で呼ばれる
    expect(onSelect).toHaveBeenCalledWith("scan");
  });

  it("正常系：AI生成ボタンをクリックするとonSelectが呼ばれる", async () => {
    // Given: MethodSelectorコンポーネントが表示されている
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<MethodSelector onSelect={onSelect} />);

    // When: ユーザーが「AIで献立・レシピ提案」ボタンをクリックする
    const aiGenerateButton = screen.getByRole("button", { name: /AIで献立・レシピ提案/ });
    await user.click(aiGenerateButton);

    // Then: onSelectが'ai-generate'で呼ばれる
    expect(onSelect).toHaveBeenCalledWith("ai-generate");
  });
});
