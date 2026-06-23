import { test, expect } from '@playwright/test';

test.describe('Auth Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/register');
  });

  test('should display register form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Εγγραφή' })).toBeVisible();

    await expect(page.locator('#First\\ Name')).toBeVisible();
    await expect(page.locator('#Last\\ Name')).toBeVisible();
    await expect(page.locator('#Email')).toBeVisible();
    await expect(page.locator('#Password')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Δημιουργία Λογαριασμού' })).toBeVisible();
  });

  test('should fill register form', async ({ page }) => {
    await page.locator('[name="firstname"]').fill('Φώτης');
    await page.locator('[name="lastname"]').fill('Παμποράκης');
    await page.locator('[name="email"]').fill('fotis@test.com');
    await page.locator('[name="password"]').fill('123456');

    await expect(page.locator('[name="firstname"]')).toHaveValue('Φώτης');
    await expect(page.locator('[name="lastname"]')).toHaveValue('Παμποράκης');
    await expect(page.locator('[name="email"]')).toHaveValue('fotis@test.com');
    await expect(page.locator('[name="password"]')).toHaveValue('123456');
  });

  test('should register successfully and redirect to code verify', async ({ page }) => {
    await page.route('**/auth/register', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      });
    });

    await page.locator('[name="firstname"]').fill('Φώτης');
    await page.locator('[name="lastname"]').fill('Παμποράκης');
    await page.locator('[name="email"]').fill('fotis@test.com');
    await page.locator('[name="password"]').fill('123456');

    await page.getByRole('button', { name: 'Δημιουργία Λογαριασμού' }).click();

    await expect(page).toHaveURL(/code-verify/);
  });

  test('should show validation errors from backend', async ({ page }) => {
    await page.route('**/auth/register', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          validationErrors: [
            'Το email είναι υποχρεωτικό.',
            'Ο κωδικός είναι υποχρεωτικός.'
          ]
        })
      });
    });

    await page.getByRole('button', { name: 'Δημιουργία Λογαριασμού' }).click();

    await expect(page.getByText('Το email είναι υποχρεωτικό.')).toBeVisible();
    await expect(page.getByText('Ο κωδικός είναι υποχρεωτικός.')).toBeVisible();
  });

  test('should show backend message error', async ({ page }) => {
    await page.route('**/auth/register', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Το email χρησιμοποιείται ήδη.'
        })
      });
    });

    await page.locator('[name="firstname"]').fill('Φώτης');
    await page.locator('[name="lastname"]').fill('Παμποράκης');
    await page.locator('[name="email"]').fill('existing@test.com');
    await page.locator('[name="password"]').fill('123456');

    await page.getByRole('button', { name: 'Δημιουργία Λογαριασμού' }).click();

    await expect(page.getByText('Το email χρησιμοποιείται ήδη.')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByText('Έχετε ήδη λογαριασμό;').click();

    await expect(page).toHaveURL(/login/);
  });

  test('should display terms and privacy links', async ({ page }) => {
  const card = page.locator('app-card');

  await expect(
    card.getByRole('link', { name: 'Όρους Παροχής Υπηρεσιών' })
  ).toBeVisible();

  await expect(
    card.getByRole('link', { name: 'Πολιτική Απορρήτου' })
  ).toBeVisible();
});

  test('should display social register buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Google/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Twitter/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Facebook/ })).toBeVisible();
  });
});