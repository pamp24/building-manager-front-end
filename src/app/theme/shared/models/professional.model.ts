export type ProfessionalCategory =
  | 'ELECTRICIAN'
  | 'PLUMBER'
  | 'ELEVATOR_TECHNICIAN'
  | 'CLEANING_SERVICE'
  | 'HEATING_TECHNICIAN'
  | 'LOCKSMITH'
  | 'AIR_CONDITION_TECHNICIAN'
  | 'PAINTER'
  | 'PEST_CONTROL'
  | 'GENERAL_REPAIRS'
  | 'OTHER';

export interface ProfessionalBusinessDTO {
  id: number;

  businessName: string;
  ownerFullName: string;

  category: ProfessionalCategory;

  description?: string;

  phone?: string;
  email?: string;
  website?: string;

  city?: string;
  region?: string;
  country?: string;
  area?: string;
  address?: string;

  taxNumber?: string;

  verified: boolean;
  active: boolean;

  ratingAverage: number;
  reviewCount: number;

  createdByUserId?: number;
  createdByUserName?: string;

  createdAt?: string;
  updatedAt?: string;

  primaryImageUrl?: string | null;
  workingHours?: string | null;
}

export interface ProfessionalBusinessRequest {
  businessName: string;
  ownerFullName: string;

  category: ProfessionalCategory;

  description?: string;

  phone: string;
  email?: string;
  website?: string;

  city: string;
  region?: string;
  country?: string;
  area?: string;
  address?: string;

  taxNumber?: string;
  workingHours?: string | null;
}

export interface ProfessionalAdminStatsDTO {
  totalBusinesses: number;
  pendingBusinesses: number;
  approvedBusinesses: number;
  inactiveBusinesses: number;
  totalReviews: number;
  totalFavorites: number;
}
