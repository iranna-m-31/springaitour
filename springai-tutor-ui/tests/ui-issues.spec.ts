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

test.describe('UI Audit – routes, navigation, and controls', () => {
  let backendStatus: BackendStatus = 'checking'

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    backendStatus = await checkBackend(page)
    await page.close()
    console.log(`\n[Backend] status: ${backendStatus}`)
  })

  // ---- 1. Static page rendering ----
  const APP_ROUTES = [
    ['/', 'Interactive Spring AI Tutorial'],
    ['/home', 'Interactive Spring AI Tutorial'],
    ['/introduction', 'Interactive Spring AI Tutorial'],
    ['/lab', 'Spring AI Lab'],
    ['/playground', 'Playground'],
    ['/settings', 'Settings'],
    ['/call-log', 'Call Log'],
    ['/download', 'Download the Full Project'],
    ['/capstone', 'Capstone Project: Spring AI Support Assistant'],
  ] as const

  const FEATURE_ROUTES = features.map((f) => [`/feature/${f.id}`, f.title]) as [string, string][]
  const LESSON_ROUTES = lessons.map((l) => [`/lesson/${l.id}`, l.title]) as [string, string][]

  for (const [path, heading] of APP_ROUTES) {
    test(`renders ${path}`, async ({ page }) => {
      await page.goto(`${UI_BASE}${path}`, { waitUntil: 'domcontentloaded' })
      await expect(page.getByRole('heading', { name: heading })).toBeVisible({ timeout: 10000 })
    })
  }

  test(`renders /completion`, async ({ page }) => {
    await page.goto(`${UI_BASE}/completion`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'Congratulations!' })).toBeVisible({ timeout: 10000 })
  })

  for (const [path, title] of FEATURE_ROUTES) {
    test(`feature page ${path} loads`, async ({ page }) => {
      await page.goto(`${UI_BASE}${path}`, { waitUntil: 'domcontentloaded' })
      const h1 = page.locator('.feature-page-header h1')
      await expect(h1).toBeVisible({ timeout: 10000 })
      await expect(h1).toContainText(title)
    })
  }

  for (const [path, title] of LESSON_ROUTES) {
    test(`lesson page ${path} loads`, async ({ page }) => {
      await page.goto(`${UI_BASE}${path}`, { waitUntil: 'domcontentloaded' })
      const h1 = page.locator('h1').first()
      await expect(h1).toBeVisible({ timeout: 10000 })
      await expect(h1).toContainText(title)
    })
  }

  // ---- Architecture Diagram Issues ----
  test.describe('Architecture Diagram', () => {
    for (const [path, title] of FEATURE_ROUTES) {
      test(`feature page ${path} architecture diagram not empty`, async ({ page }) => {
        await page.goto(`${UI_BASE}${path}`, { waitUntil: 'domcontentloaded' })
        const archSection = page.locator('.architecture-section')
        if (await archSection.count()) {
          // Check that architecture diagram section has content
          const text = await archSection.innerText()
          expect(text.trim().length).toBeGreaterThan(10)

          // Check components don't have generic/empty descriptions
          const components = page.locator('.architecture-component')
          const count = await components.count()
          for (let i = 0; i < count; i++) {
            const compText = await components.nth(i).innerText()
            // Each component should have meaningful description
            expect(compText.trim().length).toBeGreaterThan(5)
          }
        }
      })
    }

    test('architecture component descriptions are meaningful', async ({ page }) => {
      await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })
      const components = page.locator('.architecture-component')
      const count = await components.count()

      // Collect all component texts
      let totalTextLength = 0
      for (let i = 0; i < count; i++) {
        const text = await components.nth(i).innerText()
        totalTextLength += text.trim().length
      }
      // Should have substantial content, not just generic labels
      expect(totalTextLength).toBeGreaterThan(50)
    })
  })

  // ---- Removed Right Lab Panel & Sidebar Toggle ----
  test.describe('Sidebar and removed lab panel', () => {
    test('right lab panel is removed', async ({ page }) => {
      await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })

      const labPanel = page.locator('.lab-panel')
      await expect(labPanel).toHaveCount(0)

      const localLabPanel = page.locator('.local-lab-panel')
      await expect(localLabPanel).toHaveCount(0)
    })

    test('sidebar can be collapsed and reopened', async ({ page }) => {
      await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })

      const sidebar = page.locator('.learning-sidebar')
      const toggle = page.locator('.sidebar-toggle')
      const mainContent = page.locator('.lesson-content')

      await expect(sidebar).toBeVisible()
      await expect(toggle).toBeVisible()
      await expect(mainContent).toBeVisible()

      const initialSidebarWidth = await sidebar.evaluate((el) => el.getBoundingClientRect().width)
      expect(initialSidebarWidth).toBeGreaterThan(0)

      await toggle.click()
      await expect(page.locator('.app-layout')).toHaveClass(/sidebar-collapsed/)

      // Sidebar should be collapsed (width 0 and opacity 0)
      const collapsedSidebarWidth = await sidebar.evaluate((el) => el.getBoundingClientRect().width)
      expect(collapsedSidebarWidth).toBeLessThanOrEqual(1)
      await expect.poll(async () => {
        return parseFloat(await sidebar.evaluate((el) => window.getComputedStyle(el).opacity))
      }).toBeLessThanOrEqual(0.01)

      const collapsedMainWidth = await mainContent.evaluate((el) => el.getBoundingClientRect().width)
      expect(collapsedMainWidth).toBeGreaterThan(initialSidebarWidth)

      await toggle.click()
      await expect(page.locator('.app-layout')).not.toHaveClass(/sidebar-collapsed/)
      await expect(sidebar).toBeVisible()
    })

    test('sidebar lessons do not show emoji difficulty bubbles', async ({ page }) => {
      await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })

      const sidebarText = await page.locator('.learning-sidebar').innerText()
      expect(sidebarText).not.toContain('🟢')
      expect(sidebarText).not.toContain('🟡')
      expect(sidebarText).not.toContain('🟠')
      expect(sidebarText).not.toContain('🔴')
    })
  })

  // ---- Check Your Understanding Issues ----
  test.describe('Check Your Understanding', () => {
    test('checkpoint section does not take half the page', async ({ page }) => {
      await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })

      // Check checkpoint section has reasonable size (not taking 50% of viewport)
      const checkpoint = page.locator('.checkpoint-section')
      if (await checkpoint.count()) {
        const size = await checkpoint.evaluate((el) => {
          const rect = el.getBoundingClientRect()
          return { height: rect.height, width: rect.width }
        })
        const viewportHeight = await page.evaluate(() => window.innerHeight)
        // Section should not take more than 60% of viewport height
        expect(size.height).toBeLessThan(viewportHeight * 0.6)
      }
    })

    test('checkpoint does not have unnecessary emojis', async ({ page }) => {
      await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })
      const checkpointHeader = page.locator('.checkpoint-section h2')
      if (await checkpointHeader.count()) {
        const text = await checkpointHeader.innerText()
        // Header should not start with 🧪 or similar emojis
        expect(text.startsWith('🧪')).toBeFalsy()
      }
    })
  })

  // ---- Theme Toggle Issue ----
  test.describe('Theme Toggle', () => {
    test('theme toggle switches between light and dark mode', async ({ page }) => {
      await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })

      // Find theme toggle button (now in TopNav)
      const toggle = page.locator('.theme-toggle').first()

      if (await toggle.count()) {
        // Check initial background color
        const beforeBg = await toggle.evaluate((el) => {
          const parent = el.closest('body') || el
          return window.getComputedStyle(parent).backgroundColor
        })

        await toggle.click()
        await page.waitForTimeout(300)

        const afterBg = await toggle.evaluate((el) => {
          const parent = el.closest('body') || el
          return window.getComputedStyle(parent).backgroundColor
        })

        // Background should change (light <-> dark)
        expect(beforeBg).not.toEqual(afterBg)
      } else {
        console.log('Theme toggle not found - may need to check selector')
      }
    })
  })

  // ---- Doc Links Issue ----
  test.describe('Documentation Links', () => {
    const docLinks = [
      'https://docs.spring.io/spring-ai/reference/index.html',
      'https://docs.spring.io/spring-ai/reference/api/chatclient.html',
      'https://docs.spring.io/spring-ai/reference/concepts.html',
    ]

    for (const url of docLinks) {
      test(`doc link ${url} returns 200`, async ({ page }) => {
        const response = await page.request.get(url, { timeout: 10000 })
        expect(response.status()).toBe(200)
      })
    }
  })

  // ---- Top Navigation ----
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

  // ---- Mobile menu ----
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

  // ---- Search palette ----
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
})

// ---- Backend-dependent tests ----
test.describe('Backend integration', () => {
  let backendStatus: BackendStatus = 'checking'

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    backendStatus = await checkBackend(page)
    await page.close()
    console.log(`\n[Backend] status: ${backendStatus}`)
  })

  test('Try It button works when backend ready', async ({ page }) => {
    test.skip(backendStatus !== 'ready', 'Backend not ready; skipping integration checks')

    await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })
    const tryBtn = page.locator('.try-btn:not([disabled])').first()
    if (await tryBtn.count()) {
      await tryBtn.click()
      await page.waitForTimeout(5000)
      const response = page.locator('.demo-result')
      await expect(response).toBeVisible({ timeout: 10000 })
    }
  })

  test('View Source loads when backend ready', async ({ page }) => {
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

    await page.goto(`${UI_BASE}/`, { waitUntil: 'domcontentloaded' })
    await page.goto(`${UI_BASE}/feature/plain-chat`, { waitUntil: 'domcontentloaded' })
    await page.goto(`${UI_BASE}/playground`, { waitUntil: 'domcontentloaded' })
    await page.goto(`${UI_BASE}/lab`, { waitUntil: 'domcontentloaded' })
    await page.goto(`${UI_BASE}/capstone`, { waitUntil: 'domcontentloaded' })

    await page.waitForTimeout(1000)
    expect(errors).toHaveLength(0)
  })
})
