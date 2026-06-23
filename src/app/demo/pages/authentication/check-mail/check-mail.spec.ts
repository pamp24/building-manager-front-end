import { test, expect } from '@playwright/test';

test.describe('Check Mail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/auth/check-mail');
  });

  test('should display check mail title and message', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Γεια σας, ελέγξτε το email σας' })).toBeVisible();

    await expect(page.getByText('Σας στείλαμε οδηγίες για επαναφορά του κωδικού πρόσβασης στο email σας.')).toBeVisible();
  });

  test('should display login button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Σύνδεση' })).toBeVisible();
  });

  test('should display social register section', async ({ page }) => {
    await expect(page.getByText('Εγγραφή με')).toBeVisible();

    await expect(page.getByRole('button', { name: /Google/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Twitter/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Facebook/ })).toBeVisible();
  });

  test('should display logo', async ({ page }) => {
    await expect(page.locator('.auth-header img[alt="logo"]')).toBeVisible();
  });

  test('should display footer links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Building Manager' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Αρχική Σελίδα' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Επικοινωνία' })).toBeVisible();
  });
});
