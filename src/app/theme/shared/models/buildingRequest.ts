export interface BuildingRequest {
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
  floors: string; 
  apartmentsNum: number;
  sqMetersTotal: string;
  sqMetersCommonSpaces: string;
  parkingExists: boolean;
  parkingSpacesNum: number;
  active: boolean;
  enable: boolean;
  buildingDescription?: string;
  undergroundFloorExists: boolean,
  halfFloorExists: boolean,
  overTopFloorExists:  boolean,
  managerHouseExists: boolean,
  storageExists: boolean,
  storageNum: number,
  managerId: number; 
}
