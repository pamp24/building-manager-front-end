import { expect, test } from '@playwright/test';
import { mockAuthenticatedSession, mockUserApis, sampleUser } from '../../professionals/professionals.spec-helpers';

test('renders each building photo and falls back for missing, unsafe and broken images', async ({ page }) => {
  await mockAuthenticatedSession(page, { ...sampleUser, role: 'PropertyManager' });
  await mockUserApis(page);
  const buildings = [
    { id: 1, name: 'Upload', profileImageUrl: '/uploads/buildings/1/profile-image/a.png' },
    { id: 2, name: 'Relative', profileImageUrl: 'uploads/buildings/2/profile-image/b.png' },
    { id: 3, name: 'External', profileImageUrl: 'https://images.example.com/building.png' },
    { id: 4, name: 'Missing' },
    { id: 5, name: 'Unsafe', profileImageUrl: 'javascript:alert(1)' },
    { id: 6, name: 'Broken', profileImageUrl: '/uploads/buildings/6/profile-image/missing.png' },
    { id: 7, name: 'Prefixed', profileImageUrl: '/api/v1/uploads/buildings/7/profile-image/c.png' }
  ];
  await page.route('**/api/v1/buildings/my-buildings', route => route.fulfill({ json: buildings }));
  await page.route('**/uploads/**', route => route.request().url().includes('missing.png')
    ? route.fulfill({ status: 404 })
    : route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg"/>' }));
  await page.route('https://images.example.com/**', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg"/>' }));
  await page.goto('/pm/buildings');
  await expect(page.getByAltText('Upload')).toHaveAttribute('src', 'http://localhost:8080/uploads/buildings/1/profile-image/a.png');
  await expect(page.getByAltText('Relative')).toHaveAttribute('src', 'http://localhost:8080/uploads/buildings/2/profile-image/b.png');
  await expect(page.getByAltText('External')).toHaveAttribute('src', 'https://images.example.com/building.png');
  await expect(page.getByAltText('Prefixed')).toHaveAttribute('src', 'http://localhost:8080/api/v1/uploads/buildings/7/profile-image/c.png');
  for (const name of ['Missing', 'Unsafe', 'Broken']) {
    await expect(page.getByAltText(name)).toHaveAttribute('src', /assets\/images\/admin\/img-course-1\.png$/);
  }
});
