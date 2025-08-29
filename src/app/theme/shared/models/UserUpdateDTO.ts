export interface UserUpdateDTO {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address1: string;
  addressNumber1: string;
  address2?: string;
  addressNumber2?: string;
  country: string;
  state: string;
  city: string;
  region: string;
  postalCode: string;
}
