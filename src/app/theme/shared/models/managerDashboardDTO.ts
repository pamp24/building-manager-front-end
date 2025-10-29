import { MonthlyStatsDTO } from './monthlyStatsDTO';

export interface ManagerDashboardDTO {
  buildingId: number;
  buildingName?: string;
  totalIssued: number;
  totalPaid: number;
  totalPending: number;
  totalExpired: number;
  totalIncome: number;
  totalDebt: number;
  totalCancelled: number;
  totalDraft: number;
  monthlyStats: MonthlyStatsDTO[];
}