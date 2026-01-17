import { CommonExpenseAllocation } from './CommonExpenseAllocation';

export interface CommonExpenseStatement {
  id?: number;
  code: string;
  type: string;
  month: string;
  startDate: string;
  endDate: string;
  discountPercent: number;
  taxPercent: number;
  subTotal?: number;
  total?: number;
  description: string;
  sequenceNumber?: number;
  items: CommonExpenseItem[];
  buildingId?: number;
  isPaid?: boolean;
  hasPayments?: boolean;
  
  status?: 'PAID' | 'EXPIRED' | 'DRAFT' | 'ISSUED' | 'CLOSED';
  createdAt?: string;
  allocations?: CommonExpenseAllocation[];
  active?: boolean;
}

export interface CommonExpenseItem {
  id?: number;
  category: string;
  descriptionItem: string;
  quantity: number;
  price: number;
  amount?: number;
  distributionType?: 'COMMON' | 'ELEVATOR' | 'HEATING' | 'EQUAL';
}