import { test, expect, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdirSync, writeFileSync } from 'node:fs'

const RESULTS_DIR = 'visual-results'
mkdirSync(RESULTS_DIR, { recursive: true })

type Theme = 'light' | 'dark'

async function preparePage(page: Page, theme: Theme) {
  await page.addInitScript((t) => {
    try { localStorage.setItem('soul-cinema-theme', t) } catch {}
  }, theme)
}

async function gotoHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60_000 })
  try { await page.waitForLoadState('networkidle', { timeout: 15_000 }) } catch {}
  await page.evaluate(() => document.fonts?.ready)
  await page.waitForTimeout(500)
}

for (const theme of ['light', 'dark'] as Theme[]) {
  test(`Accessibility & contrast — ${theme} mode (WCAG 2.1 AA)`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
      colorScheme: theme,
    })
    const page = await context.newPage()
    await preparePage(page, theme)
    await gotoHome(page)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const report = {
      theme,
      url: page.url(),
      violationCount: results.violations.length,
      contrastViolations: results.violations.filter(v => v.id === 'color-contrast').length,
      violations: results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.slice(0, 10).map(n => ({
          target: n.target,
          html: n.html.slice(0, 240),
          failureSummary: n.failureSummary,
        })),
      })),
    }
    writeFileSync(`${RESULTS_DIR}/a11y-${theme}.json`, JSON.stringify(report, null, 2))

    const serious = results.violations.filter(
      v => v.impact === 'serious' || v.impact === 'critical',
    )
    if (serious.length) {
      console.log(`\n[a11y:${theme}] ${serious.length} serious/critical violations:`)
      for (const v of serious) console.log(`  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`)
    }

    expect(
      serious,
      `Serious/critical a11y violations in ${theme} mode — see visual-results/a11y-${theme}.json`,
    ).toEqual([])

    await context.close()
  })
}
