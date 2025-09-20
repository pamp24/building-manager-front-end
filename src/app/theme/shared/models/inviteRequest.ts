export interface inviteRequest {
  email: string;
  role: 'Resident' | 'Owner';
  apartmentId: number;

}