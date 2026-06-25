import { test, expect } from '@playwright/test'

test.describe('checkout guards', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('redirects empty cart away from checkout', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page).toHaveURL(/\/cart$/)
  })
})
