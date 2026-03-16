import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(), // @/* パスエイリアス解決
    react(),
  ],
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
