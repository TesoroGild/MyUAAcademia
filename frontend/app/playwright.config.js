// @ts-check
import { defineConfig } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
const useHttps = !!process.env.VITE_SSL_CERT_FILE;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: useHttps ? {
    baseURL: 'https://localhost:5173',
    headless: true,
    ignoreHTTPSErrors: true, // nécessaire car cert SSL local
  } : {
    baseURL: 'http://localhost:5173',
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      //use: { ...devices['Desktop Chrome'] },
      use: { browserName: 'chromium' }
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: useHttps ? [
    {
      command: 'npm run dev',
      url: 'https://localhost:5173',
      reuseExistingServer: !process.env.CI,
      ignoreHTTPSErrors: true,
    },
    {
      command: 'dotnet run --project ../../backend/src/MyUAAcademiaB.csproj --launch-profile "https"',
      url: 'https://localhost:7245',
      reuseExistingServer: !process.env.CI,
      ignoreHTTPSErrors: true,
    }
  ] : [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
  ]
});

