export interface MonthlyAmountStatsDTO {
  month: string;
  issued: number;   // ποσό εκδοθέντων (ISSUED+PAID+EXPIRED)
  pending: number;  // ποσό εκκρεμών
  paid: number;     // ποσό πληρωμένων
  expired: number;  // ποσό ληξιπρόθεσμων
}
