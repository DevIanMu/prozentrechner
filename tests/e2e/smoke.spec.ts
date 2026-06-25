import { test, expect } from '@playwright/test';

test('homepage loads in German locale', async ({ page }) => {
  await page.goto('/de/');
  await expect(page.locator('h1')).toContainText('ProzentRechner');
});
