import { test, expect, type Page } from '@playwright/test'

const BASE = 'http://localhost:8080'

interface Bug {
  severity: 'high' | 'medium' | 'low'
  area: string
  issue: string
  detail?: string
}

const bugs: Bug[] = []

function record(severity: Bug['severity'], area: string, issue: string, detail?: string) {
  bugs.push({ severity, area, issue, detail })
}

async function collectPageErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  return errors
}

test('UI audit — click through navigation and buttons', async ({ page }) => {
  test.setTimeout(300000)
  const consoleErrors = await collectPageErrors(page)

  await page.goto(BASE)
  await page.waitForLoadState('networkidle')

  // --- Top nav ---
  const topNavButtons = [
    { name: 'Home', selector: '.top-nav-link:has-text("Home")' },
    { name: 'Learn', selector: '.top-nav-link:has-text("Learn")' },
    { name: 'Lab', selector: '.top-nav-link:has-text("Lab")' },
  ]

  for (const btn of topNavButtons) {
    const el = page.locator(btn.selector).first()
    if ((await el.count()) === 0) {
      record('high', 'TopNav', `${btn.name} button missing`)
      continue
    }
    await el.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(400)
  }

  // Health pill
  const healthPill = page.locator('.health-pill').first()
  if ((await healthPill.count()) > 0) {
    await healthPill.click()
    await page.waitForTimeout(1500)
    const text = await healthPill.textContent()
    if (text?.includes('Checking')) {
      await page.waitForFunction(
        () => !document.querySelector('.health-pill')?.textContent?.includes('Checking'),
        { timeout: 10000 }
      ).catch(() => record('medium', 'TopNav', 'Health check hangs on "Checking…"'))
    }
  } else {
    record('high', 'TopNav', 'Health pill button missing')
  }

  // Get Started CTA
  const cta = page.locator('.top-nav-cta').first()
  if ((await cta.count()) > 0) {
    await cta.click()
    await page.waitForLoadState('networkidle')
    if (!page.url().includes('/introduction')) {
      record('medium', 'TopNav', 'Get Started did not navigate to /introduction', page.url())
    }
  }

  // --- Home page buttons ---
  await page.goto(BASE)
  await page.waitForLoadState('networkidle')

  const hero = page.locator('h1').first()
  if ((await hero.count()) === 0) {
    record('high', 'Home', 'Hero heading missing')
  }

  const moduleCards = page.locator('.module-card')
  const cardCount = await moduleCards.count()
  if (cardCount === 0) {
    record('high', 'Home', 'No module cards on home page')
  } else {
    await moduleCards.first().click()
    await page.waitForLoadState('networkidle')
    if (!page.url().includes('/feature/')) {
      record('medium', 'Home', 'Module card did not navigate to feature page', page.url())
    }
  }

  await page.goto(BASE)
  const healthCheckBtn = page.locator('.health-check-btn').first()
  if ((await healthCheckBtn.count()) > 0) {
    await healthCheckBtn.click()
    await page.waitForTimeout(2000)
    const details = page.locator('.health-details, .setup-warning, .skeleton')
    if ((await details.count()) === 0) {
      record('medium', 'Home', 'Run Health Check shows no feedback')
    }
  }

  const healthActions = page.locator('.health-btn')
  const actionCount = await healthActions.count()
  for (let i = 0; i < actionCount; i++) {
    const btn = healthActions.nth(i)
    const label = (await btn.textContent())?.trim() ?? `action-${i}`
    if (label.includes('Start Tutorial') || label.includes('First Feature')) {
      await btn.click()
      await page.waitForLoadState('networkidle')
    }
  }

  // --- Learning sidebar ---
  await page.goto(BASE)
  const sidebarLessons = page.locator('.learning-lesson-link')
  const lessonCount = await sidebarLessons.count()
  if (lessonCount === 0) {
    record('high', 'Sidebar', 'No lesson links in learning sidebar')
  } else {
    // First 3 lessons
    for (let i = 0; i < Math.min(3, lessonCount); i++) {
      await page.goto(BASE)
      const link = page.locator('.learning-lesson-link').nth(i)
      const href = await link.getAttribute('href')
      await link.click()
      await page.waitForLoadState('networkidle')
      if (href && !page.url().includes(href.replace(/^\//, ''))) {
        record('medium', 'Sidebar', `Lesson link navigation mismatch`, `expected ${href}, got ${page.url()}`)
      }
      // In-page nav tabs
      const tabs = page.locator('.in-page-nav-tab')
      const tabCount = await tabs.count()
      for (let t = 0; t < tabCount; t++) {
        await tabs.nth(t).click()
        await page.waitForTimeout(300)
      }
    }
  }

  // Phase toggle
  await page.goto(BASE)
  const phaseHeaders = page.locator('.learning-phase-header')
  if ((await phaseHeaders.count()) > 0) {
    await phaseHeaders.first().click()
    await page.waitForTimeout(300)
    await phaseHeaders.first().click()
  }

  // --- Introduction ---
  await page.goto(`${BASE}/introduction`)
  await page.waitForLoadState('networkidle')
  const introStart = page.locator('.intro-section .btn-primary, a.btn-primary').first()
  if ((await introStart.count()) > 0) {
    await introStart.click()
    await page.waitForLoadState('networkidle')
  }

  // --- Lab page ---
  await page.goto(`${BASE}/lab`)
  await page.waitForLoadState('networkidle')
  const runHealth = page.locator('.lab-page .btn-primary').first()
  if ((await runHealth.count()) > 0) {
    await runHealth.click()
    await page.waitForTimeout(2000)
  }
  const setupDoctorBtn = page.locator('.setup-doctor .btn-primary, .doctor-fix-btn').first()
  if ((await setupDoctorBtn.count()) > 0) {
    // just verify visible, don't run fix actions
  }

  // --- Playground ---
  await page.goto(`${BASE}/playground`)
  await page.waitForLoadState('networkidle')
  const playgroundHeading = page.locator('h2:has-text("Playground")')
  if ((await playgroundHeading.count()) === 0) {
    record('high', 'Playground', 'Playground page heading not found')
  }
  const personas = page.locator('.persona-btn')
  const personaCount = await personas.count()
  for (let i = 0; i < personaCount; i++) {
    await personas.nth(i).click()
    await page.waitForTimeout(200)
  }
  const pgInput = page.locator('.playground-form input').first()
  if ((await pgInput.count()) > 0) {
    await pgInput.fill('ping')
    const sendBtn = page.locator('.playground-form button').first()
    await sendBtn.click()
    await page.waitForTimeout(3000)
    const assistantMsg = page.locator('.chat-message.assistant')
    const errBox = page.locator('.error-box')
    if ((await assistantMsg.count()) === 0 && (await errBox.count()) === 0) {
      record('medium', 'Playground', 'Send message produced no response and no error UI')
    }
  }

  // --- Settings, Call Log, Download ---
  for (const path of ['/settings', '/call-log', '/download']) {
    await page.goto(`${BASE}${path}`)
    await page.waitForLoadState('networkidle')
    const h2 = page.locator('h2').first()
    if ((await h2.count()) === 0) {
      record('high', path, 'Page has no h2 heading')
    }
  }

  const downloadBtn = page.locator('.download-btn').first()
  if ((await downloadBtn.count()) > 0) {
    // click triggers download — just verify enabled
    if (await downloadBtn.isDisabled()) {
      record('low', 'Download', 'Download button is disabled')
    }
  } else {
    record('medium', 'Download', 'Download button missing')
  }

  // --- Capstone ---
  await page.goto(`${BASE}/capstone`)
  await page.waitForLoadState('networkidle')
  if ((await page.locator('.capstone-page, .capstone-header').count()) === 0) {
    record('high', 'Capstone', 'Capstone page content missing')
  }

  // --- Search palette Cmd+K ---
  await page.goto(BASE)
  await page.keyboard.press('Meta+K')
  await page.waitForTimeout(500)
  let palette = page.locator('.search-palette')
  if ((await palette.count()) === 0) {
    await page.keyboard.press('Control+K')
    await page.waitForTimeout(500)
  }
  palette = page.locator('.search-palette')
  if ((await palette.count()) === 0) {
    record('high', 'Search', 'Cmd/Ctrl+K search palette does not open')
  } else {
    const input = page.locator('.search-palette-input')
    await input.fill('chat')
    await page.waitForTimeout(300)
    const results = page.locator('.search-palette-result')
    if ((await results.count()) === 0) {
      record('medium', 'Search', 'Search for "chat" returns no results')
    } else {
      await results.first().click()
      await page.waitForLoadState('networkidle')
    }
    await page.keyboard.press('Escape')
  }

  // --- Local lab panel ---
  await page.goto(BASE)
  const labPanel = page.locator('.local-lab-panel')
  if ((await labPanel.count()) === 0) {
    record('high', 'Lab panel', 'Local lab panel not visible in right rail')
  } else {
    const refreshBtn = page.locator('.local-lab-panel .btn').first()
    if ((await refreshBtn.count()) > 0) {
      await refreshBtn.click()
      await page.waitForTimeout(1500)
    }
  }

  // --- Feature pages with Try It (sample) ---
  await page.goto(`${BASE}/feature/plain-chat`)
  await page.waitForLoadState('networkidle')
  const tryBtn = page.locator('.try-btn:not([disabled])').first()
  if ((await tryBtn.count()) > 0) {
    await tryBtn.click()
    await page.waitForTimeout(5000)
    const hasResult =
      (await page.locator('.markdown-viewer, .demo-result pre, .error-box, .empty-state').count()) > 0
    if (!hasResult) {
      record('medium', 'Feature demo', 'Try It on plain-chat shows no result area')
    }
  }

  // --- Mobile menu ---
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE)
  const menuToggle = page.locator('.menu-toggle')
  if ((await menuToggle.count()) === 0) {
    record('medium', 'Mobile', 'Menu toggle not visible on mobile viewport')
  } else {
    await menuToggle.click()
    const mobileMenu = page.locator('.top-nav-mobile-menu')
    if ((await mobileMenu.count()) === 0 || !(await mobileMenu.isVisible())) {
      record('high', 'Mobile', 'Mobile menu does not open')
    } else {
      const mobileHome = mobileMenu.locator('button').first()
      await mobileHome.click()
      await page.waitForLoadState('networkidle')
    }
  }

  // --- Completion page (direct) ---
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto(`${BASE}/completion`)
  await page.waitForLoadState('networkidle')
  if ((await page.locator('.completion-page, h1, h2').count()) === 0) {
    record('medium', 'Completion', '/completion page appears empty or unstyled')
  }

  // --- Console errors ---
  const uniqueErrors = [...new Set(consoleErrors)].filter(
    (e) => !e.includes('favicon') && !e.includes('404')
  )
  for (const err of uniqueErrors.slice(0, 10)) {
    record('high', 'Console', 'JavaScript console error', err.slice(0, 200))
  }

  // Print report
  console.log('\n========== UI AUDIT REPORT ==========')
  console.log(`Total issues found: ${bugs.length}`)
  for (const b of bugs) {
    console.log(`[${b.severity.toUpperCase()}] ${b.area}: ${b.issue}${b.detail ? ` — ${b.detail}` : ''}`)
  }
  console.log('=====================================\n')

  // Don't fail the test — we want the report either way
  expect(bugs.filter((b) => b.severity === 'high').length).toBeLessThan(999)
})
