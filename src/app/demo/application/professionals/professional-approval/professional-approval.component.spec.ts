import { expect, test } from '@playwright/test';

import {
  apiBaseUrl,
  mockAuthenticatedSession,
  mockUserApis,
  samplePendingProfessional,
  sampleProfessional,
  sampleUser
} from '../professionals.spec-helpers';

test.describe('ProfessionalApprovalComponent', () => {
  test('refreshes stats and lists after approving a pending business', async ({ page }) => {
    const adminUser = { ...sampleUser, role: 'Admin' };
    let stats = {
      totalBusinesses: 2,
      pendingBusinesses: 1,
      approvedBusinesses: 1,
      inactiveBusinesses: 0,
      totalReviews: 0,
      totalFavorites: 0
    };
    let pendingBusinesses = [samplePendingProfessional];
    let managedBusinesses = [sampleProfessional, samplePendingProfessional];

    await mockAuthenticatedSession(page, adminUser);
    await mockUserApis(page, adminUser);

    await page.route(`${apiBaseUrl}/professionals/admin/stats`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(stats) });
    });

    await page.route(`${apiBaseUrl}/professionals/pending`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(pendingBusinesses) });
    });

    await page.route(`${apiBaseUrl}/professionals/admin/businesses*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: managedBusinesses,
          totalPages: 1,
          totalElements: managedBusinesses.length
        })
      });
    });

    await page.route(`${apiBaseUrl}/professionals/2/approve`, async (route) => {
      stats = { ...stats, pendingBusinesses: 0, approvedBusinesses: 2 };
      pendingBusinesses = [];
      managedBusinesses = managedBusinesses.map((business) =>
        business.id === 2 ? { ...business, verified: true, active: true } : business
      );

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...samplePendingProfessional, verified: true, active: true })
      });
    });

    await page.goto('/professionals/approval');
    await expect(page.locator('strong').filter({ hasText: 'Pending Fix' }).first()).toBeVisible();

    await page.locator('.table-responsive .btn.btn-sm.btn-success').first().click();

    await expect(page.locator('.alert-success')).toBeVisible();
    await expect(page.locator('.row.mb-4 .card').nth(0)).toContainText('0');
    await expect(page.locator('.row.mb-4 .card').nth(1)).toContainText('2');
  });

  test('refreshes stats and lists after rejecting a pending business', async ({ page }) => {
    const adminUser = { ...sampleUser, role: 'Admin' };
    let stats = {
      totalBusinesses: 2,
      pendingBusinesses: 1,
      approvedBusinesses: 1,
      inactiveBusinesses: 0,
      totalReviews: 0,
      totalFavorites: 0
    };
    let pendingBusinesses = [samplePendingProfessional];
    let managedBusinesses = [sampleProfessional, samplePendingProfessional];

    await mockAuthenticatedSession(page, adminUser);
    await mockUserApis(page, adminUser);

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.route(`${apiBaseUrl}/professionals/admin/stats`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(stats) });
    });

    await page.route(`${apiBaseUrl}/professionals/pending`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(pendingBusinesses) });
    });

    await page.route(`${apiBaseUrl}/professionals/admin/businesses*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: managedBusinesses,
          totalPages: 1,
          totalElements: managedBusinesses.length
        })
      });
    });

    await page.route(`${apiBaseUrl}/professionals/2/deactivate`, async (route) => {
      stats = { ...stats, pendingBusinesses: 0, inactiveBusinesses: 1 };
      pendingBusinesses = [];
      managedBusinesses = managedBusinesses.map((business) =>
        business.id === 2 ? { ...business, verified: false, active: false } : business
      );

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      });
    });

    await page.goto('/professionals/approval');
    await page.locator('.table-responsive .btn.btn-sm.btn-outline-danger').first().click();

    await expect(page.locator('.alert-success')).toBeVisible();
    await expect(page.locator('.row.mb-4 .card').nth(0)).toContainText('0');
    await expect(page.locator('.row.mb-4 .card').nth(2)).toContainText('1');
  });
});
