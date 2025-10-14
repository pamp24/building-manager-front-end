export interface PaymentDTO {
  userId: number;
  statementId: number;
  amount: number;
  paymentMethod: string;

  referenceNumber?: string;
}