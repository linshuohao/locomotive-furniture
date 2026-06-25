import { test, expect } from '@playwright/test'
import { fillCheckoutForm } from './fixtures'

test.describe('checkout flow', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('adds to cart and completes checkout', async ({ page }) => {
    await page.goto('/products/eames-lounge-chair')

    const addToCart = page.getByTestId('add-to-cart')
    await expect(addToCart).toBeEnabled()
    await addToCart.click()

    await expect(page.locator('.cart-badge')).toHaveText('1')

    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible()
    await expect(page.getByText('Eames Lounge Chair & Ottoman')).toBeVisible()

    await page.getByTestId('cart-checkout').click()
    await expect(page).toHaveURL(/\/checkout$/)

    await fillCheckoutForm(page)
    await page.getByTestId('place-order').click()

    await expect(page).toHaveURL(/\/checkout\/success/)
    await expect(page.getByText(/order number is/i)).toBeVisible()
  })
})
