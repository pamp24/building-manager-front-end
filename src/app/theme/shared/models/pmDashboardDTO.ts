export interface PmDashboardDTO {

  summary: {
    totalBuildings: number;
    totalApartments: number;
    pendingAmount: number;
    overdueAmount: number;
  };

  attentionBuildings: AttentionBuilding[];

  recentActivity: ActivityItem[];

  notifications: DashboardNotification[];
}

export interface AttentionBuilding {
  buildingId: number;
  name: string;
  city: string;
  issue: string;
  severity: string;
}

export interface ActivityItem {
  title: string;
  description: string;
  createdAt: string;
}

export interface DashboardNotification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PmFinancialChartDTO {
  labels: string[];
  issued: number[];
  paid: number[];
  overdue: number[];
}

export interface PmExpenseCollectionRateDTO {
  collectionRate: number;
  issuedAmount: number;
  paidAmount: number;
  overdueAmount: number;
}

export interface PmAttentionBuildingDTO {
  buildingId: number;
  buildingName: string;
  buildingCode: string;
  overdueAmount: number;
  collectionRate: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
}

export interface ActivityItem {
  title: string;
  description: string;
  createdAt: string;
}

export interface PmMembershipStatsDTO {
  pendingInvites: number;
  pendingJoinRequests: number;
  joinedMembers: number;
  unassignedApartments: number;
}

export interface PmBuildingManagerRowDTO {
  buildingId: number;
  buildingName: string;
  buildingCode: string;
  city: string;

  managerId: number | null;
  managerFullName: string | null;
  managerEmail: string | null;
  managerPhone: string | null;

  managerAssigned: boolean;
}