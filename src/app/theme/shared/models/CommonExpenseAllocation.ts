export interface CommonExpenseAllocation {
  id?: number;
  itemDescription?: string;
  amount?: number;
  paidAmount?: number;
  isPaid?: boolean;
  dueDate?: string;
  paidDate?: string;
  apartmentId?: number;
  active?: boolean;
}
