import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    tsconfigPaths: true, // @/* パスエイリアス解決
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true, // describe, it, expect等をグローバルに
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["node_modules", "dist", ".next", "coverage", ".claude/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      exclude: [
        "node_modules/**",
        "src/test/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/*.test.{ts,tsx}",
        "**/__tests__/**",
        ".next/**",
        "dist/**",
        "coverage/**",
        ".claude/**",
      ],
    },
  },
});
