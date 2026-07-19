export interface ApartmentRequest {
  ownerFirstName: string;
  ownerLastName: string;
  number: string;
  sqMetersApart: string;
  floor: string;
  parkingSpace: boolean;
  parkingSlot: string | null;
  storageSlot: string | null;
  isRented: boolean;
  residentFirstName: string | null;
  residentLastName: string | null;
  commonPercent: number;
  elevatorPercent: number;
  heatingPercent: number;
  apStorageExist: boolean;
  isManagerHouse: boolean;
  active: boolean;
  enable: boolean;
  buildingId: number;
}
