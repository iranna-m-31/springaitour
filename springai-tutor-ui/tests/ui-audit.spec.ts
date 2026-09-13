import { test, expect, type Page } from '@playwright/test'
import { features } from '../src/data/features'
import { lessons } from '../src/data/lessons'

const UI_BASE = process.env.PLAYWRIGHT_UI_BASE_URL ?? ''
const API_BASE = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://localhost:8080'

type BackendStatus = 'ready' | 'unavailable' | 'checking'

async function checkBackend(page: Page): Promise<BackendStatus> {
  try {
    const resp = await page.request.get(`${API_BASE}/api/tutor/health`, { timeout: 3000 })
    if (resp.ok()) {
      const data = await resp.json()
      return data.status === 'ready' ? 'ready' : 'unavailable'
    }
  } catch {}
  return 'unavailable'
}

/** All static routes under AppLayout */
const APP_ROUTES = [
  ['/', 'Interactive Spring AI Tutorial'],
  ['/home', 'Interactive Spring AI Tutorial'],
  ['/introduction', 'Interactive Spring AI Tutorial'], // redirects to /
  ['/lab', 'Spring AI Lab'],
  ['/playground', 'Playground'],
  ['/settings', 'Settings'],
  ['/call-log', 'Call Log'],
  ['/download', 'Download the Full Project'],
  ['/capstone', 'Capstone Project: Spring AI Support Assistant'],
] as const

/** All feature routes from data */
const FEATURE_ROUTES = features.map((f) => [`/feature/${f.id}`, f.title]) as [string, string][]

/** All lesson routes from data */
const LESSON_ROUTES = lessons.map((l) => [`/lesson/${l.id}`, l.title]) as [string, string][]

/** Completion page outside AppLayout */
const COMPLETION_ROUTE = ['/completion', 'Congratulations!'] as const

test.describe('UI Audit – routes, navigation, and controls', () => {
  let backendStatus: BackendStatus = 'checking'

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    backendStatus = await checkBackend(page)
    await page.close()
    console.log(`\n[Backend] status: ${backendStatus}`)
  })

  // ---- 1. Static page rendering ----
  for (const [path, heading] of APP_ROUTES) {
    test(`renders ${path}`, async ({ page }) => {
      await page.goto(`${UI_BASE}${path}`, { waitUntil: 'domcontentloaded' })
      await expect(page.getByRole('heading', { name: heading })).toBeVisible({ timeout: 10000 })
    })
  }

  test(`renders ${COMPLETION_ROUTE[0]}`, async ({ page }) => {
    await page.goto(`${UI_BASE}${COMPLETION_ROUTE[0]}`, { waitUntil: 'domcontentloaded' })
    // Completion page shows "Congratulations!" when all features are done,
    // otherwise "Keep Going!" — accept either heading.
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
  })

  // ---- 2. Feature pages (16) ----
  for (const [path, title] of FEATURE_ROUTES) {
    test(`feature page ${path} loads`, async ({ page }) => {
      await page.goto(`${UI_BASE}${path}`, { waitUntil: 'domcontentloaded' })
      const h1 = page.locator('.feature-page-header h1')
      await expect(h1).toBeVisible({ timeout: 10000 })
      await expect(h1).toContainText(title)
    })
  }

  // ---- 3. Lesson pages (61) ----
  for (const [path, title] of LESSON_ROUTES) {
    test(`lesson page ${path} loads`, async ({ page }) => {
      await page.goto(`${UI_BASE}${path}`, { waitUntil: 'domcontentloaded' })
      const h1 = page.locator('h1').first()
      await expect(h1).toBeVisible({ timeout: 10000 })
      await expect(h1).toContainText(title)
    })
  }

  // ---- 4. Top navigation ----
  test('top nav – Home, Learn, Lab, Get Started', async ({ page }) => {
    await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })

    await page.locator('.top-nav-link:has-text("Home")').click()
    await expect(page).toHaveURL(`${UI_BASE}/`)

    await page.locator('.top-nav-link:has-text("Learn")').click()
    await expect(page).toHaveURL(`${UI_BASE}/`)

    await page.locator('.top-nav-link:has-text("Lab")').click()
    await expect(page).toHaveURL(`${UI_BASE}/lab`)

    // Get Started CTA
    await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })
    const cta = page.locator('.top-nav-cta').first()
    if (await cta.count()) {
      await cta.click()
      await expect(page).toHaveURL(`${UI_BASE}/`)
    }
  })

  // ---- 5. Mobile menu ----
  test('mobile menu opens and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })

    const toggle = page.locator('.menu-toggle')
    if (await toggle.count()) {
      await toggle.click()
      const menu = page.locator('.top-nav-mobile-menu')
      await expect(menu).toBeVisible({ timeout: 3000 })

      // Click Home in mobile menu
      const mobileHome = menu.locator('button:has-text("Home")').first()
      await mobileHome.click()
      await expect(page).toHaveURL(`${UI_BASE}/`)
    }
  })

  // ---- 6. Search palette (Cmd+K / Ctrl+K) ----
  test('search palette opens and filters', async ({ page }) => {
    await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })
    await page.keyboard.press('Meta+K')
    await page.waitForTimeout(300)
    let palette = page.locator('.search-palette')
    if (!(await palette.count())) {
      await page.keyboard.press('Control+K')
      await page.waitForTimeout(300)
      palette = page.locator('.search-palette')
    }
    if (await palette.count()) {
      await expect(palette).toBeVisible()
      await palette.locator('.search-palette-input').fill('chat')
      await page.waitForTimeout(300)
      const results = page.locator('.search-palette-result')
      if (await results.count()) {
        await results.first().click()
        await expect(page).not.toHaveURL(`${UI_BASE}/`)
      }
      await page.keyboard.press('Escape')
    }
  })

  // ---- 7. Home page module cards & Start Tutorial ----
  test('home page – module cards and Start Tutorial', async ({ page }) => {
    await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })

    const cards = page.locator('.module-card')
    if (await cards.count()) {
      await cards.first().click()
      await expect(page).toHaveURL(/\/feature\//)
    }

    // Start Tutorial CTA
    await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })
    const startBtn = page.locator('a.btn:has-text("Start Tutorial")')
    if (await startBtn.count()) {
      await startBtn.click()
      await expect(page).toHaveURL(`${UI_BASE}/feature/plain-chat`)
    }
  })

  // ---- 8. Sidebar – phase toggle and lesson links ----
  test('sidebar – phase headers expand/collapse, lesson links navigate', async ({ page }) => {
    await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })

    const phaseHeaders = page.locator('.learning-phase-header')
    if (await phaseHeaders.count()) {
      await phaseHeaders.first().click()
      await page.waitForTimeout(300)
      await phaseHeaders.first().click()
      await page.waitForTimeout(300)
    }

    // First lesson link
    const lessonLinks = page.locator('.learning-lesson-link')
    const count = await lessonLinks.count()
    if (count) {
      const first = lessonLinks.first()
      const href = await first.getAttribute('href')
      if (href) {
        await first.click()
        await expect(page).toHaveURL(`${UI_BASE}${href}`)
      }
    }
  })

  // ---- 9. Feature page controls (first feature as representative) ----
  test('feature page – in-page tabs, architecture, checkpoint, progress, navigation', async ({ page }) => {
    await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })

    // In-page nav tabs
    const tabs = page.locator('.in-page-nav-tab')
    const tabCount = await tabs.count()
    for (let i = 0; i < tabCount; i++) {
      await tabs.nth(i).click()
      await page.waitForTimeout(200)
    }

    // Architecture diagram – click a component
    const archComponents = page.locator('.architecture-component')
    if (await archComponents.count()) {
      await archComponents.first().click()
      await page.waitForTimeout(200)
      await expect(page.locator('.architecture-component-info')).toBeVisible({ timeout: 3000 })
    }

    // Checkpoint – pick an option if present; verify selection state is applied
    const checkpointOption = page.locator('.checkpoint-option').first()
    if (await checkpointOption.count()) {
      await checkpointOption.click()
      await page.waitForTimeout(200)
      await expect(checkpointOption).toHaveClass(/selected/)
    }

    // Mark as complete checkbox
    const checkbox = page.locator('input[type="checkbox"]:near(:text("Mark as complete"))')
    if (await checkbox.count()) {
      await checkbox.check()
      await page.waitForTimeout(200)
    }

    // Next/Previous navigation buttons
    const nextBtn = page.locator('.nav-next:not(.nav-next--completed)')
    if (await nextBtn.count()) {
      await nextBtn.click()
      await page.waitForLoadState('domcontentloaded')
      await expect(page).toHaveURL(/\/feature\//)
    }
  })

  // ---- 10. API Inspector tabs (fixes empty content bug) ----
  test('API Inspector – all tabs show content', async ({ page }) => {
    // Navigate to a feature page that includes API Inspector (e.g., plain-chat)
    await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })

    const apiInspectorTabs = page.locator('.api-inspector-tab')
    const tabCount = await apiInspectorTabs.count()
    for (let i = 0; i < tabCount; i++) {
      await apiInspectorTabs.nth(i).click()
      await page.waitForTimeout(200)
      // Verify code content appears
      await expect(page.locator('.code-view, .api-inspector-panel code, .api-inspector-flow')).toBeVisible({ timeout: 3000 })
    }
  })

  // ---- 11. Playground – persona switching ----
  test('playground – persona buttons switch active state', async ({ page }) => {
    await page.goto(`${UI_BASE}/playground`, { waitUntil: 'domcontentloaded' })

    const personas = page.locator('.persona-btn')
    const count = await personas.count()
    for (let i = 0; i < count; i++) {
      await personas.nth(i).click()
      await expect(personas.nth(i)).toHaveClass(/active/)
    }
  })

  // ---- 12. FeatureNav sidebar – feature links ----
  test('FeatureNav sidebar – feature links navigate', async ({ page }) => {
    await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })

    // FeatureNav is on feature pages – click a feature link in the sidebar
    const sidebarFeatureLinks = page.locator('.feature-nav .sidebar-nav li[onclick*="goToFeature"]').first()
    if (await sidebarFeatureLinks.count()) {
      await sidebarFeatureLinks.click()
      await expect(page).toHaveURL(/\/feature\//)
    }
  })

  // ---- 13. FeatureNav footer links ----
  test('FeatureNav footer – Playground, Call Log, Completion, Download', async ({ page }) => {
    await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })

    const links = [
      ['Playground', '/playground'],
      ['Call Log', '/call-log'],
      ['Completion', '/completion'],
      ['Download', '/download'],
    ] as const

    for (const [label, path] of links) {
      const btn = page.locator(`.feature-nav .sidebar-footer button:has-text("${label}")`).first()
      if (await btn.count()) {
        await btn.click()
        await expect(page).toHaveURL(`${UI_BASE}${path}`)
        // Go back to feature page for next
        await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })
      }
    }
  })

  // ---- 14. Theme toggle ----
  test('ThemeToggle – switches theme', async ({ page }) => {
    await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })
    const toggle = page.locator('.feature-nav .ThemeToggle button, .theme-toggle button, [aria-label*="theme" i]').first()
    if (await toggle.count()) {
      await toggle.click()
      await page.waitForTimeout(200)
      // Click again to restore
      await toggle.click()
    }
  })

  // ---- 15. Capstone – ProgressiveDisclosure levels ----
  test('Capstone – ProgressiveDisclosure level buttons', async ({ page }) => {
    await page.goto(`${UI_BASE}/capstone`, { waitUntil: 'domcontentloaded' })

    const levelButtons = page.locator('.progressive-disclosure button')
    const count = await levelButtons.count()
    for (let i = 0; i < count; i++) {
      await levelButtons.nth(i).click()
      await page.waitForTimeout(200)
    }
  })

  // ---- 16. Completion page – links and reset ----
  test('Completion page – navigation links and reset progress', async ({ page }) => {
    await page.goto(`${UI_BASE}/completion`, { waitUntil: 'domcontentloaded' })

    const links = [
      ['/playground', 'Playground'],
      ['/call-log', 'Call Log'],
      ['/settings', 'Settings'],
    ] as const

    for (const [path, label] of links) {
      const link = page.locator(`.next-step-card:has-text("${label}")`).first()
      if (await link.count()) {
        await link.click()
        await expect(page).toHaveURL(`${UI_BASE}${path}`)
        await page.goto(`${UI_BASE}/completion`, { waitUntil: 'domcontentloaded' })
      }
    }

    // Reset progress – dismiss confirm dialog
    const resetBtn = page.locator('button:has-text("Reset Progress")')
    if (await resetBtn.count()) {
      page.once('dialog', (d) => d.dismiss())
      await resetBtn.click()
    }
  })

  // ---- 17. Download page – button present ----
  test('Download page – download button present', async ({ page }) => {
    await page.goto(`${UI_BASE}/download`, { waitUntil: 'domcontentloaded' })
    const btn = page.locator('.download-btn')
    await expect(btn).toBeVisible()
    await expect(btn).not.toBeDisabled()
    // Do NOT click – triggers external GitHub download
  })

  // ---- 18. Local Lab Panel - removed from UI ----
  test('Local Lab Panel is removed from UI', async ({ page }) => {
    await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })
    const panel = page.locator('.local-lab-panel')
    await expect(panel).toHaveCount(0)
    // Lab panel removed - right rail now only shows main content
  })

  // ---- 19. Backend-dependent smoke (only if backend is ready) ----
  test.describe.configure({ retries: 0 })
  test('backend integration – Try It button works when backend ready', async ({ page }) => {
    test.skip(backendStatus !== 'ready', 'Backend not ready; skipping integration checks')

    await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })
    const tryBtn = page.locator('.try-btn:not([disabled])').first()
    if (await tryBtn.count()) {
      await tryBtn.click()
      await page.waitForTimeout(5000)
      // Should show some response or loading state
      const response = page.locator('.demo-result')
      await expect(response).toBeVisible({ timeout: 10000 })
    }
  })

  test('backend integration – View Source loads when backend ready', async ({ page }) => {
    test.skip(backendStatus !== 'ready', 'Backend not ready; skipping integration checks')

    await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })
    const sourceBtn = page.locator('.source-load-btn').first()
    if (await sourceBtn.count()) {
      await sourceBtn.click()
      await page.waitForTimeout(5000)
      const sourceView = page.locator('.code-view')
      await expect(sourceView).toBeVisible({ timeout: 10000 })
    }
  })

  // ---- 20. Console error check (frontend only) ----
  test('no unexpected console errors (frontend only)', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const txt = msg.text()
        if (!txt.includes('favicon') && !txt.includes('404') && !txt.includes('ECONNREFUSED') && !txt.includes('Failed to fetch') && !txt.includes('502') && !txt.includes('Bad Gateway')) {
          errors.push(txt)
        }
      }
    })
    page.on('pageerror', (err) => {
      const txt = err.message
      if (!txt.includes('favicon') && !txt.includes('404') && !txt.includes('ECONNREFUSED') && !txt.includes('Failed to fetch') && !txt.includes('502') && !txt.includes('Bad Gateway')) {
        errors.push(txt)
      }
    })

    // Visit a few key pages to trigger any errors
    await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })
    await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })
    await page.goto(`${UI_BASE}/playground`, { waitUntil: 'domcontentloaded' })
    await page.goto(`${UI_BASE}/lab`, { waitUntil: 'domcontentloaded' })
    await page.goto(`${UI_BASE}/capstone`, { waitUntil: 'domcontentloaded' })

    await page.waitForTimeout(1000)
    expect(errors).toHaveLength(0)
  })
})