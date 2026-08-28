export interface MemberPermissionDTO {
  userId: number;
  fullName: string;
  email: string;
  role?: string;
  isManager: boolean;
  canCreateAnnouncement: boolean;
  canCreatePoll: boolean;
}
