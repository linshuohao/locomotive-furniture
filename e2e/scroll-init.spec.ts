import { test, expect } from '@playwright/test'

test.describe('scroll runtime', () => {
  test('initializes locomotive scroll on first page load', async ({ page }) => {
    await page.goto('/')

    await expect
      .poll(async () =>
        page.evaluate(() => document.documentElement.classList.contains('scroll-ready')),
      )
      .toBe(true)
  })

  test('exposes scroll progress CSS variable after init', async ({ page }) => {
    await page.goto('/')

    await expect
      .poll(async () => {
        const progress = await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--scroll-progress'),
        )
        return progress.trim().length > 0
      })
      .toBe(true)
  })
})
