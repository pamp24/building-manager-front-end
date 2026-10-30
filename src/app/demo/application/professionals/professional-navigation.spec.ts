import { expect, test } from '@playwright/test';
import { apiBaseUrl, mockAuthenticatedSession, mockUserApis, sampleProfessional } from './professionals.spec-helpers';

test('updates only the business menu item when the owner data changes', async ({ page }) => {
  await mockAuthenticatedSession(page);
  await mockUserApis(page);
  let businesses: object[] = [];
  await page.route(`${apiBaseUrl}/professionals/my`, (route) => route.fulfill({ json: businesses }));
  await page.goto('/professionals/my-businesses');

  const menu = page.locator('app-nav-content');
  const myBusinesses = menu.locator('a[href="/professionals/my-businesses"]');
  const professionals = menu.locator('a[href="/professionals"]');
  await expect(myBusinesses).toHaveCount(0);
  await expect(professionals).toBeVisible();
  await expect(page.locator('.alert-info')).toBeVisible();

  businesses = [sampleProfessional];
  await professionals.click();
  await expect(myBusinesses).toBeVisible();
  await page.reload();
  await expect(myBusinesses).toBeVisible();
});

test('keeps the business menu available when the initial request fails', async ({ page }) => {
  await mockAuthenticatedSession(page);
  await mockUserApis(page);
  await page.route(`${apiBaseUrl}/professionals/my`, (route) => route.fulfill({ status: 500 }));
  await page.goto('/professionals');
  await expect(page.locator('app-nav-content a[href="/professionals/my-businesses"]')).toBeVisible();
  await expect(page.locator('app-nav-content a[href="/professionals"]')).toBeVisible();
});
