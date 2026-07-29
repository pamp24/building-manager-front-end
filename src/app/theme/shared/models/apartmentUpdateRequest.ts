export interface ApartmentUpdateRequest {
  ownerFirstName: string;
  ownerLastName: string;

  residentFirstName: string | null;
  residentLastName: string | null;

  number: string;
  floor: string;
  sqMetersApart: number;

  parkingSpace: boolean;
  parkingSlot: string | null;

  rented: boolean;

  commonPercent: number;
  elevatorPercent: number;
  heatingPercent: number;

  storageExist: boolean;
  storageSlot: string | null;

  description: string | null;
}