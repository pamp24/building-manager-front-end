import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

import { apiBaseUrl, mockAuthenticatedSession, mockUserApis, sampleImages, sampleProfessional } from '../professionals.spec-helpers';

test.describe('ProfessionalManageComponent', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await mockUserApis(page);
  });

  test('keeps business fields readonly until edit mode is enabled', async ({ page }) => {
    const images = [...sampleImages];

    await page.route(`${apiBaseUrl}/professionals/1/images`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(images)
      });
    });

    await page.route(`${apiBaseUrl}/professionals/1`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleProfessional)
      });
    });

    await page.goto('/professionals/manage/1');

    const nameInput = page.locator('label.form-label').first().locator('xpath=following-sibling::input');
    await expect(nameInput).toHaveJSProperty('readOnly', true);

    await page.locator('button.btn.btn-outline-primary').click();
    await expect(nameInput).toHaveJSProperty('readOnly', false);
  });

  test('saves edited business details successfully', async ({ page }) => {
    const images = [...sampleImages];

    await page.route(`${apiBaseUrl}/professionals/1/images`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(images)
      });
    });

    await page.route(`${apiBaseUrl}/professionals/1`, async (route) => {
      if (route.request().method() === 'PUT') {
        const payload = route.request().postDataJSON() as Record<string, string>;

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ...sampleProfessional, ...payload })
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleProfessional)
      });
    });

    await page.goto('/professionals/manage/1');

    const nameInput = page.locator('label.form-label').first().locator('xpath=following-sibling::input');

    await page.locator('button.btn.btn-outline-primary').click();
    await nameInput.fill('Updated FixIt Pros');
    await page.locator('button.btn.btn-primary').click();

    await expect(page.locator('.alert-success')).toBeVisible();
    await expect(nameInput).toHaveValue('Updated FixIt Pros');
  });

  test('uploads, sets primary, and deletes images', async ({ page }) => {
    let images = [...sampleImages];

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.route(`${apiBaseUrl}/professionals/1/images`, async (route) => {
      if (route.request().method() === 'POST') {
        images = [
          ...images,
          {
            id: 13,
            professionalId: 1,
            imageUrl: '/uploads/new-image.jpg',
            fileName: 'new-image.jpg',
            contentType: 'image/jpeg',
            primaryImage: false,
            createdAt: '2026-01-03T10:00:00Z'
          }
        ];

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(images[images.length - 1])
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(images)
      });
    });

    await page.route(`${apiBaseUrl}/professionals/images/12/primary`, async (route) => {
      images = images.map((image) => ({ ...image, primaryImage: image.id === 12 }));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(images.find((image) => image.id === 12))
      });
    });

    await page.route(`${apiBaseUrl}/professionals/images/13`, async (route) => {
      images = images.filter((image) => image.id !== 13);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      });
    });

    await page.route(`${apiBaseUrl}/professionals/1`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...sampleProfessional,
          primaryImageUrl: images.find((image) => image.primaryImage)?.imageUrl ?? sampleProfessional.primaryImageUrl
        })
      });
    });

    await page.goto('/professionals/manage/1');

    await page.locator('input[type="file"]').setInputFiles({
      name: 'upload.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image')
    });
    await page.locator('.border.rounded.p-3 button.btn.btn-success').click();

    await expect(page.locator('img[alt="professional image"]')).toHaveCount(3);

    await page.getByRole('button', { name: /^Primary$/ }).first().click();
    await expect(page.locator('.badge.bg-success', { hasText: 'Primary' })).toHaveCount(1);

    await page.locator('.card-body.p-2 button.btn.btn-outline-danger').last().click();
    await expect(page.locator('img[alt="professional image"]')).toHaveCount(2);
  });
});
