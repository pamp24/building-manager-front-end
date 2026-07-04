import { expect, test } from '@playwright/test';

import type { SupportTicketResponse, TicketCommentResponse } from 'src/app/theme/shared/models/supportTicket';

import {
  mockAuthenticatedSession,
  mockCurrentUserApi,
  sampleAgent,
  sampleComment,
  sampleHelpdeskUser,
  sampleTicket,
  supportTicketBaseUrl
} from '../../helpdesk.spec-helpers';

test.describe('TicketDetailsComponent', () => {
  test('allows a property manager to change status, assign agent, and add internal note', async ({ page }) => {
    const propertyManagerUser = { ...sampleHelpdeskUser, role: 'PropertyManager' };
    let ticket: SupportTicketResponse = { ...sampleTicket };
    let comments: TicketCommentResponse[] = [sampleComment];

    await mockAuthenticatedSession(page, propertyManagerUser);
    await mockCurrentUserApi(page, propertyManagerUser);

    await page.route(`${supportTicketBaseUrl}/1`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ticket)
      });
    });

    await page.route(`${supportTicketBaseUrl}/1/status`, async (route) => {
      const payload = route.request().postDataJSON() as Record<string, string | number>;
      ticket = { ...ticket, status: payload['status'] as SupportTicketResponse['status'] };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ticket)
      });
    });

    await page.route(`${supportTicketBaseUrl}/1/assign-agent`, async (route) => {
      const payload = route.request().postDataJSON() as Record<string, string | number>;
      ticket = { ...ticket, assignedAgentId: Number(payload['agentId']), assignedAgentName: sampleAgent.fullName };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ticket)
      });
    });

    await page.route(`${supportTicketBaseUrl}/1/comments`, async (route) => {
      if (route.request().method() === 'PATCH') {
        throw new Error('Unexpected PATCH request for comments endpoint');
      }

      if (route.request().method() === 'POST') {
        const payload = route.request().postDataJSON() as { message: string; type: string };
        const newComment: TicketCommentResponse = {
          id: 202,
          message: payload.message,
          type: payload.type as TicketCommentResponse['type'],
          createdByName: 'Panos Manager',
          createdAt: '2026-01-03T10:00:00Z'
        };
        comments = [...comments, newComment];

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(newComment)
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(comments)
      });
    });

    await page.route(`${supportTicketBaseUrl}/agents`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleAgent])
      });
    });

    await page.goto('/helpdesk/ticket/details/1');

    const selects = page.locator('.col-lg-4 .form-select');
    await selects.nth(0).selectOption({ index: 1 });
    await expect(selects.nth(0)).toHaveJSProperty('selectedIndex', 1);

    await selects.nth(1).selectOption({ label: 'Agent Smith' });
    await expect(selects.nth(1).locator('option:checked')).toHaveText('Agent Smith');
    await expect(page.locator('.list-group-item').filter({ hasText: 'Agent' }).getByText('Agent Smith')).toBeVisible();

    await page.locator('textarea.form-control').fill('Internal follow-up note');
    await page.locator('button.btn-light-warning').click();
    await expect(page.getByText('Internal follow-up note')).toBeVisible();
  });
});
