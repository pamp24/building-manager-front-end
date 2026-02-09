export interface CompanyDTO {
  companyId?: number;
  companyName: string;
  taxNumber: string;
  responsiblePerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  addressNumber: string;
  postalCode: string;
  city: string;
  region?: string;
}
