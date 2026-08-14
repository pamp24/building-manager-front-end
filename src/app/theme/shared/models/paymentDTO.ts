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
