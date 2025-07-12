
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  address1?: string;
  addressNumber1?: string;
  address2?: string;
  addressNumber2?: string;
  country?: string;
  region?: string;
  postalCode?: string;
  roles?: string[];
}
