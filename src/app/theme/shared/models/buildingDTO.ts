export interface BuildingDTO {
  id: number;
  name: string;
  street1: string;
  stNumber1: string;
  street2?: string;
  stNumber2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  state: string;
  floors: number;
  apartmentsNum: number;
  sqMetersTotal: string;
  sqMetersCommonSpaces: string;
  parkingExists: boolean;
  parkingSpacesNum: number;
  buildingCode: string;
  buildingDescription?: string;
  managerFullName: string;
  managerEmail: string;
  managerPhone: string;
  managerAddress1: string;
  managerCity: string;
}