import { expect, test } from '@playwright/test';

import { apiBaseUrl, mockAuthenticatedSession, mockUserApis } from '../professionals.spec-helpers';

test.describe('ProfessionalRegisterModalComponent', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await mockUserApis(page);

    await page.route(`${apiBaseUrl}/professionals/favorites/my`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professionals`, async (route) => {
      if (route.request().method() !== 'GET') {
        await route.fallback();
        return;
      }

      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/professionals');
    await page.locator('button.btn.btn-success').first().click();
  });

  test('updates region and city options based on the selected country', async ({ page }) => {
    const modal = page.locator('.modal-content');
    const countrySelect = modal.locator('select').nth(1);
    const regionSelect = modal.locator('select').nth(2);
    const citySelect = modal.locator('select').nth(3);

    await countrySelect.selectOption('CY');
    await expect(regionSelect).toBeEnabled();
    await expect(regionSelect).toContainText('Λευκωσία');

    await regionSelect.selectOption({ label: 'Λευκωσία' });
    await expect(citySelect).toContainText('Λευκωσία');
  });

  test('shows validation feedback when required fields are missing', async ({ page }) => {
    const modal = page.locator('.modal-content');
    await modal.locator('.modal-footer .btn.btn-primary').click();

    await expect(modal.locator('.alert-danger')).toBeVisible();
  });

  test('shows validation feedback for invalid phone, website, and tax number', async ({ page }) => {
    const modal = page.locator('.modal-content');

    await modal.locator('input[formcontrolname="businessName"]').fill('Spark Masters');
    await modal.locator('input[formcontrolname="ownerFullName"]').fill('Owner Name');
    await modal.locator('select[formcontrolname="category"]').selectOption({ index: 1 });
    await modal.locator('input[formcontrolname="phone"]').fill('abc');
    await modal.locator('input[formcontrolname="website"]').fill('not-a-url');
    await modal.locator('input[formcontrolname="taxNumber"]').fill('12');
    await modal.locator('select[formcontrolname="country"]').selectOption('CY');
    await modal.locator('select[formcontrolname="region"]').selectOption({ index: 1 });
    await modal.locator('select[formcontrolname="city"]').selectOption({ index: 1 });

    await modal.locator('.modal-footer .btn.btn-primary').click();

    await expect(modal.getByText('Παρακαλώ εισάγετε έγκυρο τηλέφωνο.')).toBeVisible();
    await expect(modal.getByText('Παρακαλώ εισάγετε έγκυρο website.')).toBeVisible();
    await expect(modal.getByText('Παρακαλώ εισάγετε έγκυρο ΑΦΜ.')).toBeVisible();
  });

  test('submits successfully and closes the modal', async ({ page }) => {
    await page.route(`${apiBaseUrl}/professionals/register`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 99 })
      });
    });

    const modal = page.locator('.modal-content');

    await modal.locator('input[formcontrolname="businessName"]').fill('Spark Masters');
    await modal.locator('input[formcontrolname="ownerFullName"]').fill('Owner Name');
    await modal.locator('select[formcontrolname="category"]').selectOption({ index: 1 });
    await modal.locator('input[formcontrolname="phone"]').fill('+35799123456');
    await modal.locator('select[formcontrolname="country"]').selectOption('CY');
    await modal.locator('select[formcontrolname="region"]').selectOption({ index: 1 });
    await modal.locator('select[formcontrolname="city"]').selectOption({ index: 1 });

    await modal.locator('.modal-footer .btn.btn-primary').click();

    await expect(modal).toHaveCount(0);
  });

  test('shows backend error when registration fails', async ({ page }) => {
    await page.route(`${apiBaseUrl}/professionals/register`, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ businessErrorDescription: 'Registration failed.' })
      });
    });

    const modal = page.locator('.modal-content');

    await modal.locator('input[formcontrolname="businessName"]').fill('Spark Masters');
    await modal.locator('input[formcontrolname="ownerFullName"]').fill('Owner Name');
    await modal.locator('select[formcontrolname="category"]').selectOption({ index: 1 });
    await modal.locator('input[formcontrolname="phone"]').fill('+35799123456');
    await modal.locator('select[formcontrolname="country"]').selectOption('CY');
    await modal.locator('select[formcontrolname="region"]').selectOption({ index: 1 });
    await modal.locator('select[formcontrolname="city"]').selectOption({ index: 1 });

    await modal.locator('.modal-footer .btn.btn-primary').click();

    await expect(modal.locator('.alert-danger')).toContainText('Registration failed.');
  });
});
