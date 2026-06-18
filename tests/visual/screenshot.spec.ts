import { test, Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const RESULTS_DIR = 'visual-results';
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const LOCAL_BASE_URL = process.env.LOCAL_BASE_URL || 'http://127.0.0.1:4173';

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

function asUrl(path: string, baseUrl: string) {
  return new URL(path, baseUrl).toString();
}

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

async function gotoWithFallback(page: Page, path = '/') {
  const primaryUrl = asUrl(path, BASE_URL);
  const fallbackUrl = asUrl(path, LOCAL_BASE_URL);
  const tried: string[] = [];

  for (const url of [primaryUrl, fallbackUrl]) {
    if (tried.includes(url)) continue;
    tried.push(url);

    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });

      try {
        await page.waitForLoadState('networkidle', { timeout: 15_000 });
      } catch {
        // Some apps keep long-lived network requests open. Screenshots are still useful.
      }

      await page.waitForTimeout(1_000);
      return { ok: true, url };
    } catch (error) {
      writeFileSync(
        `${RESULTS_DIR}/navigation-error-${path.replace(/[^a-z0-9]/gi, '-') || 'home'}.txt`,
        `Failed to open ${url}\n\n${String(error)}\n`,
        { flag: 'a' },
      );
    }
  }

  await page.setContent(`
    <html>
      <head>
        <title>Visual QA navigation failure</title>
        <style>
          body { font-family: Arial, sans-serif; background: #0A0A0A; color: #F4F0E8; padding: 48px; }
          code { color: #C9963B; word-break: break-all; }
          .card { border: 1px solid rgba(201,150,59,.4); padding: 24px; border-radius: 16px; max-width: 900px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Visual QA could not open the target page</h1>
          <p>Primary URL:</p><code>${primaryUrl}</code>
          <p>Fallback URL:</p><code>${fallbackUrl}</code>
          <p>Check preview.log and navigation-error text files in this artifact.</p>
        </div>
      </body>
    </html>
  `);
  return { ok: false, url: primaryUrl };
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
      await gotoWithFallback(page, '/');

      const hero = page.locator('#hero, section').first();
      if ((await hero.count()) > 0) {
        await hero.screenshot({ path: `${RESULTS_DIR}/${viewport.name}-hero.png` });
      } else {
        await page.screenshot({ path: `${RESULTS_DIR}/${viewport.name}-hero.png` });
      }

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
    await gotoWithFallback(page, '/admin');

    await page.screenshot({
      path: `${RESULTS_DIR}/admin-login.png`,
      fullPage: true,
    });

    await context.close();
  });
});
