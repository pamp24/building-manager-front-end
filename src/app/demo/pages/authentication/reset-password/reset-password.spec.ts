import { test, expect } from '@playwright/test';

test.describe('Reset Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/reset-password?token=test-reset-token');
  });

  test('should display reset password form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Επαναφορά Κωδικού' })).toBeVisible();
    await expect(page.getByText('Παρακαλώ επιλέξτε νέο κωδικό')).toBeVisible();

    await expect(page.locator('#Password')).toBeVisible();
    await expect(page.locator('#Conform\\ Password')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Επαναφορά Κωδικού' })).toBeVisible();
  });

  test('should fill password fields', async ({ page }) => {
    await page.locator('#Password').fill('NewPassword123!');
    await page.locator('#Conform\\ Password').fill('NewPassword123!');

    await expect(page.locator('#Password')).toHaveValue('NewPassword123!');
    await expect(page.locator('#Conform\\ Password')).toHaveValue('NewPassword123!');
  });

  test('should show alert when passwords do not match', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Οι κωδικοί δεν ταιριάζουν!');
      await dialog.accept();
    });

    await page.locator('#Password').fill('Password123!');
    await page.locator('#Conform\\ Password').fill('Different123!');

    await page.getByRole('button', { name: 'Επαναφορά Κωδικού' }).click();
  });

  test('should show alert when token is missing', async ({ page }) => {
    await page.goto('/auth/reset-password');

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Λείπει το token επαναφοράς.');
      await dialog.accept();
    });

    await page.locator('#Password').fill('Password123!');
    await page.locator('#Conform\\ Password').fill('Password123!');

    await page.getByRole('button', { name: 'Επαναφορά Κωδικού' }).click();
  });

  test('should reset password successfully and redirect to login', async ({ page }) => {
    await page.route('**/auth/reset-password*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      });
    });

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Ο κωδικός επαναφέρθηκε επιτυχώς!');
      await dialog.accept();
    });

    await page.locator('#Password').fill('NewPassword123!');
    await page.locator('#Conform\\ Password').fill('NewPassword123!');

    await page.getByRole('button', { name: 'Επαναφορά Κωδικού' }).click();

    await expect(page).toHaveURL(/auth\/login/);
  });

  test('should show backend error alert', async ({ page }) => {
    await page.route('**/auth/reset-password*', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Το token έχει λήξει ή είναι άκυρο'
        })
      });
    });

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Σφάλμα στην επαναφορά κωδικού');
      expect(dialog.message()).toContain('Το token έχει λήξει ή είναι άκυρο');
      await dialog.accept();
    });

    await page.locator('#Password').fill('NewPassword123!');
    await page.locator('#Conform\\ Password').fill('NewPassword123!');

    await page.getByRole('button', { name: 'Επαναφορά Κωδικού' }).click();
  });

  test('should display footer links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Building Manager' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Αρχική Σελίδα' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Επικοινωνία' })).toBeVisible();
  });
});