import { expect, test } from '@playwright/test';

import {
  mockAuthenticatedSession,
  mockCurrentUserApi,
  sampleHelpdeskUser,
  sampleTicket,
  sampleTicketTwo,
  supportTicketBaseUrl
} from '../helpdesk.spec-helpers';

test.describe('HelpdeskDashboardComponent', () => {
  test('renders dashboard summary from helpdesk tickets', async ({ page }) => {
    await mockAuthenticatedSession(page, sampleHelpdeskUser);
    await mockCurrentUserApi(page, sampleHelpdeskUser);

    await page.route(`${supportTicketBaseUrl}/list-view`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          sampleTicket,
          { ...sampleTicket, id: 3, ticketNumber: 'HD-003', status: 'IN_PROGRESS', assignedAgentId: 99, assignedAgentName: 'Agent Smith' },
          { ...sampleTicketTwo, status: 'RESOLVED' }
        ])
      });
    });

    await page.goto('/helpdesk/dashboard');

    await expect(page.locator('.summary-value').nth(0)).toContainText('3');
    await expect(page.locator('.summary-value.text-primary')).toContainText('1');
    await expect(page.locator('.summary-value.text-warning')).toContainText('1');
    await expect(page.locator('.summary-value.text-success')).toContainText('1');
    await expect(page.getByRole('cell', { name: 'HD-003', exact: true }).first()).toBeVisible();
  });
});
