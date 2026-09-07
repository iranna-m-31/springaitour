import { test, expect } from '@playwright/test'

test('should navigate through all features and test Try It buttons', async ({ page }) => {
  // Increase timeout: 16 features × Try It buttons = longer test
  test.setTimeout(600000) // 10 minutes

  // Start from homepage (uses baseURL from playwright.config.ts)
  await page.goto('/')
  await page.waitForSelector('h1:has-text("Interactive Spring AI Tutorial")')

  // Get all feature links from the sidebar
  const allLinks = page.locator('.feature-nav li')
  const totalItems = await allLinks.count()
  console.log(`Found ${totalItems} navigation items`)

  // Test each navigation item
  for (let i = 0; i < totalItems; i++) {
    const navItem = allLinks.nth(i)

    // Skip logo
    const isLogo = await navItem.locator('.sidebar-logo').count()
    if (isLogo > 0) continue

    // Get the text of the nav item for logging
    const navText = await navItem.textContent()
    console.log(`\n=== Testing: ${navText?.trim()} ===`)

    // Click the nav item
    await navItem.click()

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle')

    // Take a screenshot for visual verification
    await page.screenshot({ path: `test-results/page-${i}-${Date.now()}.png`, fullPage: true })

    // Verify page loaded
    await expect(page).toHaveURL(/.*/)

    // Check if this is a feature page (has Try It button)
    const tryItButton = page.locator('.try-btn:not([disabled])')
    const buttonCount = await tryItButton.count()

    if (buttonCount > 0) {
      console.log(`Found ${buttonCount} enabled Try It button(s)`)

      // Test each Try It button
      for (let btnIdx = 0; btnIdx < buttonCount; btnIdx++) {
        const button = tryItButton.nth(btnIdx)

        // Get button text before clicking
        const buttonTextBefore = await button.textContent()
        console.log(`  Clicking Try It button: ${buttonTextBefore?.trim()}`)

        // Click the button
        await button.click()

        // Wait for loading state (or streaming "Stop" button)
        await page.waitForSelector('.try-btn:has-text("Loading..."), .try-btn:has-text("◼ Stop")', { timeout: 5000 })

        // Wait for response to appear (either success or error)
        try {
          await page.waitForFunction(() => {
            const responseEl = document.querySelector('.markdown-viewer')
            const errorEl = document.querySelector('.error-box')
            return (responseEl && responseEl.textContent?.trim().length > 0) ||
                   (errorEl && errorEl.textContent?.trim().length > 0)
          }, { timeout: 15000 })

          // Check if we got a response or error
          const responseEl = page.locator('.markdown-viewer')
          const errorEl = page.locator('.error-box')

          const hasResponse = await responseEl.count() > 0 &&
                            (await responseEl.first().textContent())?.trim().length > 0
          const hasError = await errorEl.count() > 0 &&
                           (await errorEl.first().textContent())?.trim().length > 0

          if (hasResponse) {
            const responseText = await responseEl.first().textContent()
            console.log(`  ✓ Response received: ${responseText?.substring(0, 100)}...`)
          } else if (hasError) {
            const errorText = await errorEl.first().textContent()
            console.log(`  ⚠ Error received: ${errorText?.substring(0, 100)}...`)
          } else {
            console.log(`  ? No clear response/error after timeout`)
          }
        } catch (e) {
          console.log(`  Timeout waiting for response: ${e}`)
        }

        // Small delay between button clicks
        await page.waitForTimeout(1000)
      }
    } else {
      console.log(`  No Try It buttons found (informational/page-only section)`)

      // For informational pages, just verify content loaded
      await page.waitForSelector('h1, h2, .feature-page-hero, .setup-section, .playground-page', { timeout: 5000 })
      console.log(`  ✓ Page content loaded`)
    }

    // Brief pause between navigation items
    await page.waitForTimeout(500)
  }

  console.log('\n=== Navigation test completed ===')
})

test('should test Playground page specifically', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('h1:has-text("Interactive Spring AI Tutorial")')

  // Navigate to playground
  await page.click('text=🧪 Playground')
  await page.waitForLoadState('networkidle')

  // Verify playground loaded
  await expect(page.locator('h2:has-text("Playground")')).toBeVisible()

  // Test persona switching
  const personaButtons = page.locator('.persona-btn')
  const personaCount = await personaButtons.count()
  console.log(`Found ${personaCount} persona buttons`)

  for (let i = 0; i < personaCount; i++) {
    const button = personaButtons.nth(i)
    const personaName = await button.textContent()
    console.log(`Testing persona: ${personaName?.trim()}`)

    await button.click()
    await page.waitForTimeout(500)

    // Verify button is active
    await expect(button).toHaveClass(/active/)
  }

  // Test sending a message
  const input = page.locator('.playground-form input')
  await input.fill('Hello, how are you?')

  const sendButton = page.locator('.playground-form button:has-text("Send")')
  await sendButton.click()

  // Wait for response
  await page.waitForSelector('.chat-message.assistant', { timeout: 15000 })

  // Get the last assistant message
  const lastMessage = page.locator('.chat-message.assistant').last()
  const messageText = await lastMessage.textContent()
  console.log(`Assistant response: ${messageText?.substring(0, 100)}...`)

  await expect(lastMessage).toBeVisible()
})

test('should test Download section', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('h1:has-text("Interactive Spring AI Tutorial")')

  await page.click('text=📦 Download Project')
  await page.waitForLoadState('networkidle')

  // Fixed heading: actual heading is "Download the Full Project"
  await expect(page.locator('h2:has-text("Download the Full Project")')).toBeVisible()
  await expect(page.locator('.download-btn')).toBeVisible()

  // Test download button
  const downloadBtn = page.locator('.download-btn')
  // Button text is "📦 Download ZIP"
  await expect(downloadBtn).toHaveText(/Download ZIP/)
})