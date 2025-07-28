export interface ApartmentDTO {
  fullApartmentName: string;
  fullName: string;
  isRented: boolean;
  tenantFullName: string | null;
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

  apDescription: string;

  active: boolean;
  enable: boolean;
  managerFullName: string;
  managerId: string;


  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerStreet: string;
  ownerStreetNumber?: string;
  ownerCity: string;

}
