import { defineConfig } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || process.env.LOCAL_BASE_URL || 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: 'tests/visual',
  timeout: 60_000,
  expect: {
    // Allow tiny anti-aliasing diffs; fail on real visual regressions.
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, threshold: 0.2, animations: 'disabled' },
  },
  // Auto-create snapshots when missing so first CI run seeds baselines as an artifact.
  updateSnapshots: 'missing',
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    navigationTimeout: 60_000,
    actionTimeout: 15_000,
    colorScheme: 'light',
  },
})
