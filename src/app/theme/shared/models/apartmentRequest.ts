export interface ApartmentRequest {
  fullName: string;
  number: string;
  sqMetersApart: string;
  floor: number;
  parkingSpace: boolean;
  parkingSlot?: string;
  isRented: boolean;
  tenantFullName?: string;
  commonPercent: number;
  elevatorPercent: number;
  heatingPercent: number;
  active: boolean;
  enable: boolean;
  buildingId: number;
}

