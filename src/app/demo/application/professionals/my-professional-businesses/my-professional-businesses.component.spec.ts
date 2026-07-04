import { expect, test } from '@playwright/test';

import { apiBaseUrl, mockAuthenticatedSession, mockUserApis, sampleProfessional } from '../professionals.spec-helpers';

test.describe('MyProfessionalBusinessesComponent', () => {
  test('renders current user businesses with manage links', async ({ page }) => {
    await mockAuthenticatedSession(page);
    await mockUserApis(page);

    await page.route(`${apiBaseUrl}/professionals/my`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleProfessional])
      });
    });

    await page.goto('/professionals/my-businesses');

    await expect(page.getByText(sampleProfessional.businessName)).toBeVisible();
    await expect(page.getByRole('link', { name: /Διαχείριση/i })).toHaveAttribute('href', /\/professionals\/manage\/1$/);
  });

  test('shows an empty state when the user has no businesses', async ({ page }) => {
    await mockAuthenticatedSession(page);
    await mockUserApis(page);

    await page.route(`${apiBaseUrl}/professionals/my`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('/professionals/my-businesses');

    await expect(page.locator('.alert-info')).toBeVisible();
  });
});
