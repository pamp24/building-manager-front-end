export interface BuildingFinanceDTO {
  buildingName: string;
  buildingCode: string;
  userRole: string;
  managerView: boolean;

  myPending: number;
  myPaid: number;
  lastStatementId: number | null;
  lastStatementMonth: string | null;

  statements: UserStatementDTO[];
  recentPayments: PaymentDTO[];
  currentMonthExpenses: ExpenseCategorySummaryDTO[];

  totalBuildingPending: number;
  totalBuildingCollected: number;
  collectionRate: number;
  totalApartments: number;
  totalMembers: number;
  memberPaymentStatuses: MemberPaymentStatus[];
}

export interface UserStatementDTO {
  statementId: number;
  month: string;
  code: string;
  totalForBuilding: number;
  totalForApartment: number;
  paidAmount: number;
  remainingAmount: number;
  isPaid: boolean;
  issueDate: string;
  dueDate: string;
  status: string;
}

export interface PaymentDTO {
  id?: number;
  userFullName?: string;
  userId: number;
  statementId: number;
  amount: number;
  paymentDate?: string;
  paymentMethod: string;
  apartmentId?: number;
  referenceNumber?: string;
  gateway?: string;
  gatewayTransactionId?: string;
  gatewayStatus?: string;
}

export interface ExpenseCategorySummaryDTO {
  category: string;
  totalAmount: number;
}

export interface MemberPaymentStatus {
  userId: number | null;
  fullName: string;
  apartmentId: number;
  apartmentNumber: string;
  amountDue: number;
  amountPaid: number;
  status: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID';
}
