export interface AdminUserDTO {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  city?: string;
  region?: string;
  createdDate?: string;
  lastLoginDate?: string;
  enabled: boolean;
  accountLocked: boolean;
  deleted: boolean;
  role?: string;
}
