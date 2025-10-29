export interface PaymentDTO {
  userId: number;
  statementId: number;
  amount: number;
  paymentMethod: string;
  apartmentId?: number;
  referenceNumber?: string;
}