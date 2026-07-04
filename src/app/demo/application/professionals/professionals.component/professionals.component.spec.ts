import { expect, test } from '@playwright/test';

import { apiBaseUrl, mockAuthenticatedSession, mockUserApis, sampleProfessional } from '../professionals.spec-helpers';

test.describe('ProfessionalsComponent', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page, undefined, { buildingId: 99 });
    await mockUserApis(page);
  });

  test('shows location filters only after opening the filters panel', async ({ page }) => {
    await page.route(`${apiBaseUrl}/professionals/favorites/my`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professional-partners/buildings/99`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professionals*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleProfessional])
      });
    });

    await page.goto('/professionals');

    await expect(page.locator('label.form-label', { hasText: 'Χώρα' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Φίλτρα' }).click();
    await expect(page.locator('label.form-label', { hasText: 'Χώρα' })).toBeVisible();
    await expect(page.locator('label.form-label', { hasText: 'Νομός' })).toBeVisible();
  });

  test('shows only matching regions when country changes', async ({ page }) => {
    await page.route(`${apiBaseUrl}/professionals/favorites/my`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professional-partners/buildings/99`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professionals*`, async (route) => {
      const url = new URL(route.request().url());
      const country = url.searchParams.get('country');

      const response =
        country === 'CY'
          ? [{ ...sampleProfessional, id: 5, country: 'CY', region: 'Λευκωσία', city: 'Λευκωσία' }]
          : [sampleProfessional];

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });

    await page.goto('/professionals');
    await page.getByRole('button', { name: 'Φίλτρα' }).click();

    const countrySelect = page.locator('label.form-label', { hasText: 'Χώρα' }).locator('xpath=following-sibling::select');
    const regionSelect = page.locator('label.form-label', { hasText: 'Νομός' }).locator('xpath=following-sibling::select');

    await countrySelect.selectOption('CY');
    await expect(regionSelect).toBeEnabled();
    await expect(regionSelect).toContainText('Λευκωσία');

    await countrySelect.selectOption('GR');
    await expect(regionSelect).toContainText('Αττική');
  });

  test('filters professionals by free-text search and minimum reviews', async ({ page }) => {
    await page.route(`${apiBaseUrl}/professionals/favorites/my`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professional-partners/buildings/99`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professionals*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          sampleProfessional,
          {
            ...sampleProfessional,
            id: 2,
            businessName: 'Pipe Rescue',
            category: 'PLUMBER',
            ownerFullName: 'Maria Pipes',
            reviewCount: 1
          }
        ])
      });
    });

    await page.goto('/professionals');

    await page.locator('label.form-label', { hasText: 'Αναζήτηση' }).locator('xpath=following-sibling::input').fill('pipe');
    await expect(page.getByText('Pipe Rescue')).toBeVisible();
    await expect(page.getByText('FixIt Pros')).toHaveCount(0);

    await page.locator('label.form-label', { hasText: 'Reviews' }).locator('xpath=following-sibling::select').selectOption('3');
    await expect(page.getByText('Pipe Rescue')).toHaveCount(0);
    await expect(page.locator('.alert.alert-info')).toContainText('Δεν βρέθηκαν επαγγελματίες');
  });

  test('shows a placeholder instead of a broken phone link when phone is missing', async ({ page }) => {
    await page.route(`${apiBaseUrl}/professionals/favorites/my`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professional-partners/buildings/99`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professionals*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ ...sampleProfessional, id: 6, phone: undefined }])
      });
    });

    await page.goto('/professionals');

    const firstCard = page.locator('.list-group-item').filter({ hasText: 'Τηλέφωνο' }).first();
    await expect(firstCard).toContainText('-');
    await expect(firstCard.locator('a[href^="tel:"]')).toHaveCount(0);
  });

  test('toggles favorite state for a professional', async ({ page }) => {
    let favoriteIds: number[] = [];

    await page.route(`${apiBaseUrl}/professionals/favorites/my`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(favoriteIds.map((id) => ({ ...sampleProfessional, id })))
      });
    });

    await page.route(`${apiBaseUrl}/professional-partners/buildings/99`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professionals/favorites/1`, async (route) => {
      if (route.request().method() === 'POST') {
        favoriteIds = [1];
      } else if (route.request().method() === 'DELETE') {
        favoriteIds = [];
      }

      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
    });

    await page.route(`${apiBaseUrl}/professionals*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleProfessional])
      });
    });

    await page.goto('/professionals');

    const favoriteButton = page.locator('.d-flex.gap-2.mt-3').first().locator('button.btn.btn-sm').nth(1);
    await favoriteButton.click();
    await expect(favoriteButton).toHaveClass(/btn-danger/);

    await favoriteButton.click();
    await expect(favoriteButton).toHaveClass(/btn-outline-danger/);
  });

  test('toggles partner state for a professional', async ({ page }) => {
    let partnerIds: number[] = [];

    await page.route(`${apiBaseUrl}/professionals/favorites/my`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professional-partners/buildings/99`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(partnerIds.map((id) => ({ ...sampleProfessional, id })))
      });
    });

    await page.route(`${apiBaseUrl}/professional-partners/buildings/99/professionals/1`, async (route) => {
      if (route.request().method() === 'POST') {
        partnerIds = [1];
      } else if (route.request().method() === 'DELETE') {
        partnerIds = [];
      }

      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
    });

    await page.route(`${apiBaseUrl}/professionals*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleProfessional])
      });
    });

    await page.goto('/professionals');

    const partnerButton = page.locator('.d-flex.gap-2.mt-3').first().locator('button.btn.btn-sm').nth(2);
    await partnerButton.click();
    await expect(partnerButton).toContainText('Συνεργάτης');

    await partnerButton.click();
    await expect(partnerButton).toContainText('Ορισμός Συνεργάτη');
  });
});
