import { expect, test } from '@playwright/test';

import {
  apiBaseUrl,
  mockAuthenticatedSession,
  mockUserApis,
  sampleImages,
  sampleProfessional,
  sampleReviews
} from '../professionals.spec-helpers';

test.describe('ProfessionalDetailsModalComponent', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await mockUserApis(page);

    await page.route(`${apiBaseUrl}/professionals/favorites/my`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route(`${apiBaseUrl}/professionals`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([sampleProfessional])
      });
    });
  });

  test('renders reviews and image navigation inside the modal', async ({ page }) => {
    await page.route(`${apiBaseUrl}/professionals/1/reviews`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleReviews)
      });
    });

    await page.route(`${apiBaseUrl}/professionals/1/images`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleImages)
      });
    });

    await page.goto('/professionals');
    await page.locator('.btn.btn-sm.btn-primary').first().click();

    const modal = page.locator('.modal-content');

    await expect(modal.getByText(sampleProfessional.businessName)).toBeVisible();
    await expect(modal.getByText('Excellent service')).toBeVisible();

    await modal.locator('img[alt="thumbnail"]').nth(1).click();
    await expect(modal.locator('.position-relative .badge.bg-dark.position-absolute')).toContainText('2 / 2');
  });

  test('submits a new review and refreshes the list', async ({ page }) => {
    let reviews = [...sampleReviews];

    await page.route(`${apiBaseUrl}/professionals/1/reviews`, async (route) => {
      if (route.request().method() === 'POST') {
        const payload = route.request().postDataJSON() as { rating: number; comment: string };
        reviews = [
          {
            id: 102,
            professionalId: 1,
            rating: payload.rating,
            comment: payload.comment,
            reviewerId: 7,
            reviewerName: 'Admin',
            createdAt: '2026-01-04T12:00:00Z',
            updatedAt: '2026-01-04T12:00:00Z'
          },
          ...reviews
        ];

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(reviews[0])
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(reviews)
      });
    });

    await page.route(`${apiBaseUrl}/professionals/1/images`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleImages)
      });
    });

    await page.goto('/professionals');
    await page.locator('.btn.btn-sm.btn-primary').first().click();

    const modal = page.locator('.modal-content');

    await modal.locator('textarea').fill('Fast and reliable');
    await modal.locator('.border.rounded.p-3 button.btn.btn-primary').click();

    await expect(modal.getByText('Fast and reliable')).toBeVisible();
  });

  test('shows manage action for the business owner', async ({ page }) => {
    await page.route(`${apiBaseUrl}/professionals/1/reviews`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleReviews)
      });
    });

    await page.route(`${apiBaseUrl}/professionals/1/images`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleImages)
      });
    });

    await page.goto('/professionals');
    await page.locator('.btn.btn-sm.btn-primary').first().click();

    const modal = page.locator('.modal-content');
    await expect(modal.locator('.modal-footer button.btn.btn-primary')).toBeVisible();
  });
});
