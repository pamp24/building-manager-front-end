import { test, expect } from '@playwright/test';

test.describe('Auth Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/auth/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Σύνδεση' })).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Σύνδεση' })).toBeVisible();
  });

  test('should show validation messages when form is empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Σύνδεση' }).click();

    await expect(page.getByText('Το email είναι υποχρεωτικό.')).toBeVisible();
    await expect(page.getByText('Ο κωδικός πρόσβασης είναι υποχρεωτικός')).toBeVisible();
  });

  test('should show invalid email message', async ({ page }) => {
    await page.locator('#email').fill('wrong-email');
    await page.locator('#password').fill('123456');

    await page.getByRole('button', { name: 'Σύνδεση' }).click();

    await expect(page.getByText('Παρακαλώ εισάγετε έγκυρο email.')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('#password');

    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.locator('#togglePassword').click();

    await expect(passwordInput).toHaveAttribute('type', 'text');

    await page.locator('#togglePassword').click();

    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should login successfully and redirect to dashboard', async ({ page }) => {
    await page.route('**/auth/authenticate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-jwt-token',
          user: {
            id: 1,
            email: 'test@test.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'User'
          }
        })
      });
    });

    await page.locator('#email').fill('test@test.com');
    await page.locator('#password').fill('123456');

    await page.getByRole('button', { name: 'Σύνδεση' }).click();

    await expect(page).toHaveURL(/dashboard\/default/);
  });

  test('should show backend login error', async ({ page }) => {
    await page.route('**/auth/authenticate', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          businessErrorDescription: 'Λάθος email ή κωδικός πρόσβασης.'
        })
      });
    });

    await page.locator('#email').fill('wrong@test.com');
    await page.locator('#password').fill('wrongpassword');

    await page.getByRole('button', { name: 'Σύνδεση' }).click();

    await expect(page.getByText('Λάθος email ή κωδικός πρόσβασης.')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.getByText('Δεν έχετε λογαριασμό;').click();

    await expect(page).toHaveURL(/register/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByText('Ξεχάσατε τον κωδικό;').click();

    await expect(page).toHaveURL(/forgot-password/);
  });

  test('should display social login buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Google/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Twitter/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Facebook/ })).toBeVisible();
  });
});