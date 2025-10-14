import { MonthlyStatsDTO } from './monthlyStatsDTO';

export interface ManagerDashboardDTO {
  buildingId: number;
  buildingName?: string;
  totalIssued: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalIncome: number;
  totalDebt: number;
  monthlyStats: MonthlyStatsDTO[];
}