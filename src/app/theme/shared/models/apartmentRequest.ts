export interface ApartmentRequest {
  fullName: string;
  number: string;
  sqMetersApart: string;
  floor: string;
  parkingSpace: boolean;
  parkingSlot?: string;
  isRented: boolean;
  tenantFullName?: string;
  commonPercent: number;
  elevatorPercent: number;
  heatingPercent: number;
  apStorageExists: boolean;
  storageSlot?: string;
  isManagerHouse: boolean;
  active: boolean;
  enable: boolean;
  buildingId: number;
}
