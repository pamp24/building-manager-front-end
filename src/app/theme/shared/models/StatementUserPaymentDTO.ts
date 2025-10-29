export interface StatementUserPaymentDTO {
  userId: number;
  userFirstName: string;
  userLastName: string;
  apartmentId: number | null;
  apartmentNumber: string;
  apartmentFloor: string;
  amountToPay: number;
  paidAmount: number;
  paidDate: string;
  paymentMethod: string;
  status: string;
}