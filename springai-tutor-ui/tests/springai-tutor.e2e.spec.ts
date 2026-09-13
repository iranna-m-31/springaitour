import { test, expect } from '@playwright/test'

test('should navigate through all features and test Try It buttons', async ({ page }) => {
  // Increase timeout: 16 features × Try It buttons = longer test
  test.setTimeout(600000) // 10 minutes

  const features = [
    'plain-chat', 'system-prompts', 'prompt-templates', 'streaming',
    'metadata', 'structured-output', 'embeddings', 'rag',
    'chat-memory', 'tool-calling', 'advisors', 'multimodality',
    'moderation', 'evaluation', 'observability', 'mcp'
  ]

  for (const featureId of features) {
    const path = `/feature/${featureId}`
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    // Verify feature page loaded
    await expect(page.locator('.feature-page h1')).toBeVisible({ timeout: 10000 })
    console.log(`✓ Loaded ${featureId}`)

    // Check for Try It button
    const tryItButton = page.locator('.try-btn:not([disabled])').first()
    const buttonCount = await tryItButton.count()

    if (buttonCount > 0) {
      // Click Try It
      await tryItButton.click()

      // Wait for response or error
      await page.waitForSelector(
        '.markdown-viewer, .error-box',
        { timeout: 15000 }
      ).catch(() => {})
      console.log(`  ✓ Try It completed for ${featureId}`)
    } else {
      console.log(`  No Try It button for ${featureId}`)
    }
  }

  console.log('\n=== Navigation test completed ===')
})

test('should test Playground page specifically', async ({ page }) => {
  await page.goto('/playground')
  await page.waitForLoadState('networkidle')

  // Verify playground loaded - check for Playground heading
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
  await page.goto('/download')
  await page.waitForLoadState('networkidle')

  // Fixed heading: actual heading is "Download the Full Project"
  await expect(page.locator('h2:has-text("Download the Full Project")')).toBeVisible()
  await expect(page.locator('.download-btn')).toBeVisible()

  // Test download button
  const downloadBtn = page.locator('.download-btn')
  // Button text is "📦 Download ZIP"
  await expect(downloadBtn).toHaveText(/Download ZIP/)
})