export interface UserUpdateDTO {
  firstName: string;
  lastName: string;
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
}