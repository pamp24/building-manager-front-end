export type BuildingMemberStatus = 'INVITED' | 'PENDING' | 'JOINED' | 'PENDING_APARTMENT' | 'REJECTED' | 'REMOVED' | 'LEFT';

export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';

export type MemberDisplayStatus = BuildingMemberStatus | InviteStatus;

export interface BuildingMemberDTO {
  id: number | null;
  userId: number | null;
  fullName: string | null;
  email: string;
  role: string;
  profileImageUrl?: string | null;
  status: MemberDisplayStatus;
  buildingId: number;
  buildingName: string;
  apartmentNumber?: string | null;
  floor?: string | null;
}
