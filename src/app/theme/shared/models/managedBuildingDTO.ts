export interface ManagedBuildingDTO {
    id: number;
    name: string;
    street1?: string;
    streetNumber1?: string;
    street2?: string;
    streetNumber2?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    apartmentCount: number;
    unitCount: number;
    managerId: number;
}