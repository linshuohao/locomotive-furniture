import type { Page } from '@playwright/test'

export async function fillCheckoutForm(page: Page) {
  await page.locator('#email').fill('buyer@example.com')
  await page.locator('#firstName').fill('Alex')
  await page.locator('#lastName').fill('Morgan')
  await page.locator('#address').fill('123 Design Street')
  await page.locator('#city').fill('Montreal')
  await page.locator('#country').fill('Canada')
  await page.locator('#postalCode').fill('H2X 1Y4')
}
