import { expect, test } from '@playwright/test';

import {
  buildingsBaseUrl,
  mockAuthenticatedSession,
  mockCurrentUserApi,
  sampleBuilding,
  sampleHelpdeskUser,
  sampleTicket,
  sampleTicketTwo,
  supportTicketBaseUrl
} from '../../helpdesk.spec-helpers';

test.describe('TicketListComponent', () => {
  test('filters displayed tickets by selected property manager building', async ({ page }) => {
    await mockAuthenticatedSession(page, sampleHelpdeskUser);
    await mockCurrentUserApi(page, sampleHelpdeskUser);

    await page.route(`${buildingsBaseUrl}/pm/my-company-buildings`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleBuilding, { ...sampleBuilding, id: 2, name: 'North Tower', street1: 'Second', stNumber1: '20' }])
      });
    });

    await page.route(`${supportTicketBaseUrl}/list-view`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleTicket, sampleTicketTwo])
      });
    });

    await page.goto('/helpdesk/ticket/list');

    await expect(page.locator('select.form-select').first().locator('option:checked')).toHaveText('Sunset Plaza');
    await expect(page.locator('input.readonly-input')).toHaveValue(/Main 10, Athens/);
    await expect(page.getByText('Elevator noise')).toBeVisible();
    await expect(page.getByText('Heating not working')).toHaveCount(0);

    await page.locator('select.form-select').first().selectOption({ label: 'North Tower' });
    await expect(page.locator('select.form-select').first().locator('option:checked')).toHaveText('North Tower');
    await expect(page.locator('input.readonly-input')).toHaveValue(/Second 20/);
    await expect(page.getByText('Heating not working')).toBeVisible();
    await expect(page.getByText('Elevator noise')).toHaveCount(0);
  });
});
