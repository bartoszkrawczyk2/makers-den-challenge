import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (!env.VITE_GITHUB_TOKEN)
    throw new Error("VITE_GITHUB_TOKEN env variable is missing");

  return {
    plugins: [react()],
    test: {
      environment: "happy-dom",
      setupFiles: ["./vitest-setup.ts"],
    },
  };
});
