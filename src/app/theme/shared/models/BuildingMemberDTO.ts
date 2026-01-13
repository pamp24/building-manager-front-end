export interface BuildingMemberDTO {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
  buildingId: number;
  buildingName: string;
  apartmentNumber?: string;
  floor?: string;
}
