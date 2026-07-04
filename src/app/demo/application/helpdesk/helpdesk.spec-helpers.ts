import { Page } from '@playwright/test';

import type { SupportTicketResponse, TicketAgentResponse, TicketCommentResponse } from 'src/app/theme/shared/models/supportTicket';

export const apiBaseUrl = 'http://localhost:8080/api/v1';
export const supportTicketBaseUrl = `${apiBaseUrl}/support-tickets`;
export const buildingsBaseUrl = `${apiBaseUrl}/buildings`;
export const apartmentsBaseUrl = `${apiBaseUrl}/apartments`;

export const sampleHelpdeskUser = {
  id: 21,
  firstName: 'Panos',
  lastName: 'Manager',
  email: 'manager@test.com',
  role: 'PropertyManager'
};

export const sampleAdminUser = {
  id: 1,
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@test.com',
  role: 'Admin'
};

export const sampleResidentUser = {
  id: 33,
  firstName: 'Niki',
  lastName: 'Resident',
  email: 'resident@test.com',
  role: 'Resident'
};

export const sampleBuilding = {
  id: 1,
  name: 'Sunset Plaza',
  street1: 'Main',
  stNumber1: '10',
  city: 'Athens',
  region: 'Attica',
  postalCode: '11111',
  country: 'GR',
  state: 'ACTIVE',
  floors: 5,
  apartmentsNum: 12,
  sqMetersTotal: 1200,
  sqMetersCommonSpaces: 120,
  parkingExist: true,
  parkingSpacesNum: 8,
  buildingCode: 'SUN123',
  undergroundFloorExist: false,
  halfFloorExist: false,
  overTopFloorExist: false,
  storageExist: false,
  storageNum: 0,
  managerHouseExist: false,
  managerFullName: 'Panos Manager',
  managerEmail: 'manager@test.com',
  managerPhone: '2100000000',
  managerAddress1: 'Main 10',
  managerCity: 'Athens',
  managerRole: 'PROPERTY_MANAGER',
  hasCentralHeating: true,
  company: { id: 50, companyName: 'Prime PM' }
};

export const sampleApartment = {
  id: 101,
  fullApartmentName: 'A1',
  ownerFirstName: 'John',
  ownerLastName: 'Doe',
  isRented: false,
  residentFirstName: null,
  residentLastName: null,
  number: 'A1',
  sqMetersApart: '90',
  floor: '1',
  parkingSpace: false,
  parkingSlot: null,
  commonPercent: 10,
  elevatorPercent: 10,
  heatingPercent: 10,
  apStorageExist: false,
  storageSlot: null,
  isManagerHouse: false,
  lastModifiedDate: '2026-01-01T10:00:00Z',
  apDescription: '',
  active: true,
  enable: true,
  managerFullName: 'Panos Manager',
  managerId: '21',
  residentId: null,
  residentEmail: null,
  residentPhone: null,
  ownerId: 77,
  ownerFullName: 'John Doe',
  ownerEmail: 'john@test.com',
  ownerPhone: '2100001111',
  ownerStreet: 'Main',
  ownerStreetNumber: '10',
  ownerCity: 'Athens',
  buildingId: 1,
  buildingName: 'Sunset Plaza',
  buildingStreet: 'Main',
  buildingStreetNumber: '10',
  buildingCity: 'Athens'
};

export const sampleTicket: SupportTicketResponse = {
  id: 1,
  ticketNumber: 'HD-001',
  title: 'Elevator noise',
  description: 'Strange noise from the elevator shaft.',
  status: 'OPEN',
  priority: 'HIGH',
  category: 'ELEVATOR',
  targetRole: 'PROPERTY_MANAGER',
  buildingId: 1,
  buildingName: 'Sunset Plaza',
  apartmentId: 101,
  apartmentLabel: 'A1',
  createdByUserId: 33,
  createdByName: 'Niki Resident',
  createdAt: '2026-01-02T10:00:00Z',
  updatedAt: '2026-01-02T11:00:00Z',
  closedAt: null,
  assignedAgentId: null,
  assignedAgentName: null
};

export const sampleTicketTwo: SupportTicketResponse = {
  ...sampleTicket,
  id: 2,
  ticketNumber: 'HD-002',
  title: 'Heating not working',
  category: 'HEATING',
  buildingId: 2,
  buildingName: 'North Tower',
  updatedAt: '2026-01-03T11:00:00Z'
};

export const sampleAgent: TicketAgentResponse = {
  id: 99,
  fullName: 'Agent Smith'
};

export const sampleComment: TicketCommentResponse = {
  id: 201,
  message: 'We are checking it.',
  type: 'REPLY',
  createdByName: 'Agent Smith',
  createdAt: '2026-01-02T12:00:00Z'
};

export async function mockAuthenticatedSession(page: Page, user = sampleHelpdeskUser): Promise<void> {
  await page.addInitScript((currentUser) => {
    localStorage.setItem('token', 'playwright-token');
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, user);
}

export async function mockCurrentUserApi(page: Page, user = sampleHelpdeskUser): Promise<void> {
  await page.route(`${apiBaseUrl}/users/current-user`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(user)
    });
  });
}
