export interface StatementUserPaymentDTO {
  userId: number;
  userFullName: string;
  apartmentId: number | null;
  apartmentNumber: string;
  apartmentFloor: string;
  amountToPay: number;
  paidAmount: number;
  paidDate: string;
  paymentMethod: string;
  status: string;
}