import { test, expect } from '@playwright/test';

test.describe('Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  test('should display forgot password form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ξέχασα τον Κωδικό' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Επιστροφή στην Είσοδο' })).toBeVisible();
    await expect(page.locator('#floatingInput')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Αποστολή Email Επαναφοράς Κωδικού' })).toBeVisible();
  });

  test('should fill email field', async ({ page }) => {
    await page.locator('#floatingInput').fill('test@test.com');

    await expect(page.locator('#floatingInput')).toHaveValue('test@test.com');
  });

  test('should send reset email successfully and redirect to check email page', async ({ page }) => {
    await page.route('**/auth/forgot-password*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      });
    });

    await page.locator('#floatingInput').fill('test@test.com');

    await page.getByRole('button', { name: 'Αποστολή Email Επαναφοράς Κωδικού' }).click();

    await expect(page).toHaveURL(/auth\/check-email/);
  });

  test('should handle backend error without redirect', async ({ page }) => {
    await page.route('**/auth/forgot-password*', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Ο χρήστης δεν βρέθηκε.'
        })
      });
    });

    await page.locator('#floatingInput').fill('notfound@test.com');

    await page.getByRole('button', { name: 'Αποστολή Email Επαναφοράς Κωδικού' }).click();

    await expect(page).toHaveURL(/forgot-password/);
  });

  test('should navigate back to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Επιστροφή στην Είσοδο' }).click();

    await expect(page).toHaveURL(/login/);
  });

  test('should display spam notice text', async ({ page }) => {
    await expect(
      page.getByText('Μην ξεχάσετε να ελέγξετε το φάκελο Ανεπιθύμητης Αλληλογραφίας (SPAM).')
    ).toBeVisible();
  });

  test('should display footer links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Building Manager' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Αρχική Σελίδα' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Επικοινωνία' })).toBeVisible();
  });
});