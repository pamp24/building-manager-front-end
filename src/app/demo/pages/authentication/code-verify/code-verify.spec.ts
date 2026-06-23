import { test, expect } from '@playwright/test';

test.describe('Code Verify Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/code-verify');
  });

  test('should display code verify form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Ενεργοποίηση Λογαριασμού' })).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Εισάγετε τον Κωδικό Επιβεβαίωσης' })
    ).toBeVisible();

    await expect(page.getByText('Σας στείλαμε ένα μήνυμα στο email σας.')).toBeVisible();
    await expect(page.getByText('Σας στείλαμε έναν κωδικό στο testmail')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Συνέχεια' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Επαναποστολή κωδικού' })).toBeVisible();
  });

  test('should show error when submitting empty code', async ({ page }) => {
    await page.getByRole('button', { name: 'Συνέχεια' }).click();

    await expect(page.getByRole('heading', { name: 'Η ενεργοποίηση απέτυχε!' })).toBeVisible();
    await expect(page.getByText('Παρακαλώ συμπληρώστε έγκυρο κωδικό.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Δοκιμάστε ξανά' })).toBeVisible();
  });

  test('should return to form when retry button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Συνέχεια' }).click();

    await page.getByRole('button', { name: 'Δοκιμάστε ξανά' }).click();

    await expect(page.getByRole('heading', { name: 'Ενεργοποίηση Λογαριασμού' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Συνέχεια' })).toBeVisible();
  });

  test('should activate account successfully', async ({ page }) => {
    await page.route('**/auth/activate-account*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      });
    });

    await page.locator('input').first().fill('1');
    await page.locator('input').nth(1).fill('2');
    await page.locator('input').nth(2).fill('3');
    await page.locator('input').nth(3).fill('4');
    await page.locator('input').nth(4).fill('5');
    await page.locator('input').nth(5).fill('6');

    await page.getByRole('button', { name: 'Συνέχεια' }).click();

    await expect(
      page.getByRole('heading', { name: 'Η ενεργοποίηση ολοκληρώθηκε με επιτυχία!' })
    ).toBeVisible();

    await expect(
      page.getByText('Ο λογαριασμός σας ενεργοποιήθηκε με επιτυχία.')
    ).toBeVisible();

    await expect(page.getByRole('button', { name: 'Μετάβαση στην είσοδο' })).toBeVisible();
  });

  test('should show activation error when backend returns error', async ({ page }) => {
    await page.route('**/auth/activate-account*', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Το token έχει λήξει ή είναι άκυρο'
        })
      });
    });

    await page.locator('input').first().fill('1');
    await page.locator('input').nth(1).fill('2');
    await page.locator('input').nth(2).fill('3');
    await page.locator('input').nth(3).fill('4');
    await page.locator('input').nth(4).fill('5');
    await page.locator('input').nth(5).fill('6');

    await page.getByRole('button', { name: 'Συνέχεια' }).click();

    await expect(page.getByRole('heading', { name: 'Η ενεργοποίηση απέτυχε!' })).toBeVisible();
    await expect(page.getByText('Το token έχει λήξει ή είναι άκυρο')).toBeVisible();
  });

  test('should navigate to login after successful activation', async ({ page }) => {
    await page.route('**/auth/activate-account*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({})
      });
    });

    await page.locator('input').first().fill('1');
    await page.locator('input').nth(1).fill('2');
    await page.locator('input').nth(2).fill('3');
    await page.locator('input').nth(3).fill('4');
    await page.locator('input').nth(4).fill('5');
    await page.locator('input').nth(5).fill('6');

    await page.getByRole('button', { name: 'Συνέχεια' }).click();

    await page.getByRole('button', { name: 'Μετάβαση στην είσοδο' }).click();

    await expect(page).toHaveURL(/login/);
  });

  test('should display footer links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Building Manager' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Αρχική Σελίδα' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Επικοινωνία' })).toBeVisible();
  });
});