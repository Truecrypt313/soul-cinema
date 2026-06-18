import { test, expect, Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const RESULTS_DIR = 'visual-results';
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173';

mkdirSync(RESULTS_DIR, { recursive: true });

type ViewportPreset = {
  name: 'desktop' | 'mobile';
  width: number;
  height: number;
  isMobile?: boolean;
};

const viewports: ViewportPreset[] = [
  { name: 'desktop', width: 1440, height: 1200 },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];

async function preparePage(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        scroll-behavior: auto !important;
      }
      .lovable-badge, [data-lovable-badge], iframe[src*="lovable"] {
        display: none !important;
        visibility: hidden !important;
      }
    `,
  });
}

async function openAndStabilize(page: Page, path = '/') {
  await page.goto(new URL(path, BASE_URL).toString(), {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });

  try {
    await page.waitForLoadState('networkidle', { timeout: 15_000 });
  } catch {
    // Some apps keep long-lived network connections open. Screenshots are still useful.
  }

  await page.waitForTimeout(1_000);
}

test.describe('Soul Cinema visual QA screenshots', () => {
  for (const viewport of viewports) {
    test(`${viewport.name} home and hero screenshots`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile ?? false,
        deviceScaleFactor: viewport.isMobile ? 2 : 1,
      });
      const page = await context.newPage();
      await preparePage(page);
      await openAndStabilize(page, '/');

      await expect(page.locator('body')).toBeVisible();

      const hero = page.locator('#hero, section').first();
      await hero.screenshot({ path: `${RESULTS_DIR}/${viewport.name}-hero.png` });
      await page.screenshot({
        path: `${RESULTS_DIR}/${viewport.name}-home-full.png`,
        fullPage: true,
      });

      await context.close();
    });
  }

  test('admin/login screenshot', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    await preparePage(page);
    await openAndStabilize(page, '/admin');

    await page.screenshot({
      path: `${RESULTS_DIR}/admin-login.png`,
      fullPage: true,
    });

    await context.close();
  });
});
