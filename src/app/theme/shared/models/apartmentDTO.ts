export interface ApartmentDTO {
  fullApartmentName: string;
  ownerFirstName: string;
  ownerLastName: string;
  isRented: boolean;
  residentFirstName: string | null;
  residentLastName: string | null;
  number: string;
  sqMetersApart: string;
  floor: string;
  parkingSpace: boolean;
  parkingSlot: string | null;
  commonPercent: number;
  elevatorPercent: number;
  heatingPercent: number;
  apStorageExist: boolean;
  storageSlot: string | null;
  isManagerHouse: boolean;
  lastModifiedDate: string;

  apDescription: string;

  active: boolean;
  enable: boolean;
  managerFullName: string;
  managerId: string;
  
  residentEmail: string | null;
  residentPhone: string | null;

  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerStreet: string;
  ownerStreetNumber?: string;
  ownerCity: string;

  buildingName: string;
  buildingStreet: string;
  buildingStreetNumber?: string;
  buildingCity?: string;

}
