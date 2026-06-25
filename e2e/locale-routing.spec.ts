import { test, expect } from '@playwright/test'

test.describe('locale routing', () => {
  test('switches to Chinese prefix and shows translated catalog', async ({ page }) => {
    await page.goto('/products')

    await page.getByTestId('locale-switcher').click()
    await expect(page).toHaveURL(/\/zh\/products/)
    await expect(page.getByRole('heading', { name: '系列' })).toBeVisible()
    await expect(page.getByTestId('locale-switcher')).toHaveText('English')
  })

  test('switches back to English without prefix', async ({ page }) => {
    await page.goto('/zh/products')

    await page.getByTestId('locale-switcher').click()
    await expect(page).toHaveURL(/\/products$/)
    await expect(page.getByRole('heading', { name: 'The Collection' })).toBeVisible()
    await expect(page.getByTestId('locale-switcher')).toHaveText('中文')
  })
})
