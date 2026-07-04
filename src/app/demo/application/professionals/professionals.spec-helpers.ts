import { Page } from '@playwright/test';

export const apiBaseUrl = 'http://localhost:8080/api/v1';

export const sampleUser = {
  id: 7,
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@test.com',
  role: 'Admin',
  professionalsFavoritesOnly: false
};

export const sampleProfessional = {
  id: 1,
  businessName: 'FixIt Pros',
  ownerFullName: 'Alex Fixer',
  category: 'ELECTRICIAN',
  description: 'Trusted maintenance services.',
  phone: '2100000000',
  email: 'hello@fixit.test',
  website: 'https://fixit.test',
  city: 'Athens',
  region: 'Attica',
  country: 'GR',
  area: 'Center',
  address: 'Test 1',
  taxNumber: '123456789',
  workingHours: 'Mon-Fri 09:00-17:00',
  verified: true,
  active: true,
  ratingAverage: 4.8,
  reviewCount: 2,
  createdByUserId: 7,
  createdByUserName: 'Admin User',
  primaryImageUrl: '/uploads/fixit-main.jpg'
};

export const samplePendingProfessional = {
  ...sampleProfessional,
  id: 2,
  businessName: 'Pending Fix',
  verified: false,
  active: false,
  primaryImageUrl: null
};

export const sampleImages = [
  {
    id: 11,
    professionalId: 1,
    imageUrl: '/uploads/fixit-main.jpg',
    fileName: 'fixit-main.jpg',
    contentType: 'image/jpeg',
    primaryImage: true,
    createdAt: '2026-01-01T10:00:00Z'
  },
  {
    id: 12,
    professionalId: 1,
    imageUrl: '/uploads/fixit-second.jpg',
    fileName: 'fixit-second.jpg',
    contentType: 'image/jpeg',
    primaryImage: false,
    createdAt: '2026-01-02T10:00:00Z'
  }
];

export const sampleReviews = [
  {
    id: 101,
    professionalId: 1,
    rating: 5,
    comment: 'Excellent service',
    reviewerId: 3,
    reviewerName: 'Maria',
    createdAt: '2026-01-01T12:00:00Z',
    updatedAt: '2026-01-01T12:00:00Z'
  }
];

export async function mockAuthenticatedSession(
  page: Page,
  user = sampleUser,
  options: { buildingId?: number } = {}
): Promise<void> {
  await page.addInitScript(
    ({ currentUser, buildingId }) => {
      localStorage.setItem('token', 'playwright-token');
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      if (buildingId) {
        localStorage.setItem('buildingId', String(buildingId));
      } else {
        localStorage.removeItem('buildingId');
      }
    },
    { currentUser: user, buildingId: options.buildingId }
  );
}

export async function mockUserApis(page: Page, user = sampleUser): Promise<void> {
  await page.route(`${apiBaseUrl}/users/current-user`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(user)
    });
  });

  await page.route(`${apiBaseUrl}/users/preferences/professionals-favorites-only*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({})
    });
  });
}
