import { test, expect, Page } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const RESULTS_DIR = 'visual-results'
mkdirSync(RESULTS_DIR, { recursive: true })

type Theme = 'light' | 'dark'
type ViewportPreset = { name: 'desktop' | 'mobile'; width: number; height: number; isMobile?: boolean }

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const

const viewports: ViewportPreset[] = [
  { name: 'desktop', width: 1440, height: 1200 },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
]

async function preparePage(page: Page, theme: Theme) {
  // Seed theme + freeze motion/media BEFORE the app boots.
  await page.addInitScript((t) => {
    try { localStorage.setItem('soul-cinema-theme', t) } catch {}
  }, theme)
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
        caret-color: transparent !important;
      }
      video { visibility: hidden !important; }
      .lovable-badge, [data-lovable-badge], iframe[src*="lovable"] { display: none !important; }
    `,
  })
}

async function gotoHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60_000 })
  try { await page.waitForLoadState('networkidle', { timeout: 15_000 }) } catch {}
  await page.evaluate(() => document.fonts?.ready)
  await page.waitForTimeout(800)
}

for (const theme of ['light', 'dark'] as Theme[]) {
  for (const vp of viewports) {
    test.describe(`Visual regression — ${theme} / ${vp.name}`, () => {
      for (const section of SECTIONS) {
        test(`${section.label} section matches baseline`, async ({ browser }) => {
          const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            isMobile: vp.isMobile ?? false,
            deviceScaleFactor: vp.isMobile ? 2 : 1,
            colorScheme: theme,
          })
          const page = await context.newPage()
          await preparePage(page, theme)
          await gotoHome(page)

          const target = page.locator(`#${section.id}`).first()
          await target.scrollIntoViewIfNeeded()
          await page.waitForTimeout(400)
          await expect(target).toHaveScreenshot(
            `${section.id}-${theme}-${vp.name}.png`,
            { animations: 'disabled', maxDiffPixelRatio: 0.02 },
          )
          await context.close()
        })
      }
    })
  }
}
