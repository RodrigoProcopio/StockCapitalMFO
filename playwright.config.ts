// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
  },
  webServer: {
  command: 'npm run preview',
  url: 'http://localhost:4173',
  timeout: 120_000,   // era 60_000, agora 120s
  reuseExistingServer: true,
},
});
