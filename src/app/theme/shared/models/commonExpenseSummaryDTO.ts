export interface CommonStatementSummaryDTO {
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  percentPaid: number;
  paidPercent?: number;
  lastDueDate: string | null;
}