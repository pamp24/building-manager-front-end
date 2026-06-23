import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testMatch: '**/*.spec.ts',

  webServer: {
    command: 'npm start',
    port: 4200,
    reuseExistingServer: true
  },

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});