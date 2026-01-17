import { MonthlyStatsDTO } from './monthlyStatsDTO';
import { MonthlyAmountStatsDTO } from 'src/app/theme/shared/models/monthlyAmountStatsDTO';

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
  monthlyAmountStats: MonthlyAmountStatsDTO[];
}