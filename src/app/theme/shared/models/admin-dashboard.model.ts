export interface AdminDashboardResponse {
  overview: PlatformOverview;
  userActivity: UserActivity;
  buildingActivity: BuildingActivity;
  apartmentUsage: ApartmentUsage;
  operationalIssues: OperationalIssues;
  engagementStats: EngagementStats;
  growthStats: GrowthStats;
}

export interface PlatformOverview {
  totalBuildings: number;
  totalUsers: number;
  totalCompanies: number;
  totalManagers: number;
}

export interface UserActivity {
  activeUsersToday: number;
  activeUsersThisWeek: number;
  newRegistrationsThisMonth: number;
}

export interface BuildingActivity {
  newBuildingsThisMonth: number;
  totalBuildings: number;
  buildingsWithoutManager: number;
  buildingsWithoutApartments: number;
}

export interface ApartmentUsage {
  totalApartments: number;
  assignedApartments: number;
  vacantApartments: number;
}

export interface OperationalIssues {
  buildingsWithoutManager: number;
  apartmentsWithoutOwner: number;
  pendingInvites: number;
}

export interface EngagementStats {
  announcementsCount: number;
  votingsCount: number;
  participationRate: number;
  invitesSent: number;
  invitesAccepted: number;
  pendingInvites: number;
}

export interface GrowthPoint {
  date: string;
  value: number;
}

export interface GrowthStats {
  userGrowth: GrowthPoint[];
  buildingGrowth: GrowthPoint[];
  inviteGrowth: GrowthPoint[];
}