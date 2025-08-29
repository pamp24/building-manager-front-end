export interface ApartmentRequest {
  ownerFirstName: string;
  ownerLastName: string;
  number: string;
  sqMetersApart: string;
  floor: string;
  parkingSpace: boolean;
  parkingSlot?: string;
  isRented: boolean;
  residentFirstName: string | null;
  residentLastName: string | null;
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
