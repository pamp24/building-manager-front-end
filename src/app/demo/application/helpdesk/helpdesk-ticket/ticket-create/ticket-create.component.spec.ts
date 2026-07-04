import { expect, test } from '@playwright/test';

import {
  apartmentsBaseUrl,
  buildingsBaseUrl,
  mockAuthenticatedSession,
  mockCurrentUserApi,
  sampleAdminUser,
  sampleApartment,
  sampleBuilding,
  sampleResidentUser,
  supportTicketBaseUrl
} from '../../helpdesk.spec-helpers';

test.describe('TicketCreateComponent', () => {
  test('loads target roles and submits a helpdesk ticket successfully', async ({ page }) => {
    const buildingManagerUser = { ...sampleResidentUser, id: 44, role: 'BuildingManager' };

    await mockAuthenticatedSession(page, buildingManagerUser);
    await mockCurrentUserApi(page, buildingManagerUser);

    await page.route(`${buildingsBaseUrl}/my-buildings`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleBuilding])
      });
    });

    await page.route(`${apartmentsBaseUrl}/building/1/list`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleApartment])
      });
    });

    await page.route(`${supportTicketBaseUrl}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 5,
          ticketNumber: 'HD-005',
          title: 'New ticket',
          description: 'Need support',
          status: 'OPEN',
          priority: 'MEDIUM',
          category: 'OTHER',
          targetRole: 'PROPERTY_MANAGER',
          buildingId: 1,
          buildingName: 'Sunset Plaza',
          apartmentId: 101,
          apartmentLabel: 'A1',
          createdByUserId: 44,
          createdByName: 'Niki Resident',
          createdAt: '2026-01-04T10:00:00Z',
          updatedAt: '2026-01-04T10:00:00Z'
        })
      });
    });

    await page.goto('/helpdesk/ticket/create');

    await expect(page.locator('select[formcontrolname="targetRole"] option:checked')).toContainText('Επιλέξτε');
    await page.locator('select[formcontrolname="targetRole"]').selectOption('PROPERTY_MANAGER');
    await expect(page.locator('select[formcontrolname="buildingId"] option:checked')).toHaveText('Sunset Plaza');

    await page.locator('select[formcontrolname="apartmentId"]').selectOption({ index: 1 });
    await page.locator('input[formcontrolname="title"]').fill('New ticket');
    await page.locator('textarea[formcontrolname="description"]').fill('Need support');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.alert.alert-success')).toBeVisible();
  });

  test('allows admin to create a ticket for any building in the app', async ({ page }) => {
    await mockAuthenticatedSession(page, sampleAdminUser);
    await mockCurrentUserApi(page, sampleAdminUser);

    await page.route(`${buildingsBaseUrl}/admin/all`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleBuilding, { ...sampleBuilding, id: 2, name: 'North Tower', company: null }])
      });
    });

    await page.route(`${apartmentsBaseUrl}/building/2/list`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.route(`${apartmentsBaseUrl}/building/1/list`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleApartment])
      });
    });

    await page.route(`${supportTicketBaseUrl}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 6,
          ticketNumber: 'HD-006',
          title: 'Admin ticket',
          description: 'Admin-created ticket',
          status: 'OPEN',
          priority: 'HIGH',
          category: 'OTHER',
          targetRole: 'BUILDING_MANAGER',
          buildingId: 2,
          buildingName: 'North Tower',
          apartmentId: null,
          apartmentLabel: null,
          createdByUserId: 1,
          createdByName: 'Admin User',
          createdAt: '2026-01-04T10:00:00Z',
          updatedAt: '2026-01-04T10:00:00Z'
        })
      });
    });

    await page.goto('/helpdesk/ticket/create');

    await expect(page.locator('select[formcontrolname="targetRole"] option:checked')).toContainText('Επιλέξτε');
    await page.locator('select[formcontrolname="targetRole"]').selectOption('BUILDING_MANAGER');
    await expect(page.locator('select[formcontrolname="buildingId"] option')).toHaveCount(3);

    await page.locator('select[formcontrolname="targetRole"]').selectOption('PROPERTY_MANAGER');
    await expect(page.locator('select[formcontrolname="buildingId"] option')).toHaveCount(2);
    await expect(page.locator('select[formcontrolname="buildingId"] option:checked')).toHaveText('Sunset Plaza');

    await page.locator('select[formcontrolname="targetRole"]').selectOption('BUILDING_MANAGER');
    await page.locator('select[formcontrolname="buildingId"]').selectOption({ label: 'North Tower' });
    await expect(page.locator('select[formcontrolname="buildingId"] option:checked')).toHaveText('North Tower');

    await page.locator('input[formcontrolname="title"]').fill('Admin ticket');
    await page.locator('textarea[formcontrolname="description"]').fill('Admin-created ticket');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.alert.alert-success')).toBeVisible();
  });

  test('keeps the building field disabled until a recipient role is selected', async ({ page }) => {
    await mockAuthenticatedSession(page, sampleAdminUser);
    await mockCurrentUserApi(page, sampleAdminUser);

    await page.route(`${buildingsBaseUrl}/admin/all`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleBuilding])
      });
    });

    await page.goto('/helpdesk/ticket/create');

    const targetRoleSelect = page.locator('select[formcontrolname="targetRole"]');
    const buildingSelect = page.locator('select[formcontrolname="buildingId"]');

    await expect(targetRoleSelect.locator('option:checked')).toContainText('Επιλέξτε');
    await expect(buildingSelect).toBeDisabled();

    await targetRoleSelect.selectOption('BUILDING_MANAGER');
    await expect(buildingSelect).toBeEnabled();

    await targetRoleSelect.selectOption({ index: 0 });
    await expect(buildingSelect).toBeDisabled();
  });
});
