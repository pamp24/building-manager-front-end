import { COUNTRIES, Country } from 'src/app/theme/shared/data/countries.data';
import { CYPRUS_LOCATIONS, CyprusRegion } from 'src/app/theme/shared/data/cyprus-locations.data';
import { GREECE_LOCATIONS, GreeceRegion } from 'src/app/theme/shared/data/greece-locations.data';

export type SupportedLocationRegion = GreeceRegion | CyprusRegion;

const COUNTRY_LOCATIONS: Record<string, SupportedLocationRegion[]> = {
  GR: GREECE_LOCATIONS,
  CY: CYPRUS_LOCATIONS
};

export const LOCATION_COUNTRIES: Country[] = COUNTRIES;

export function resolveCountryCode(countryValue: string | null | undefined): string {
  if (!countryValue) {
    return '';
  }

  const byCode = COUNTRIES.find((country) => country.code === countryValue);

  if (byCode) {
    return byCode.code;
  }

  return COUNTRIES.find((country) => country.name === countryValue)?.code ?? '';
}

export function resolveCountryName(countryValue: string | null | undefined): string {
  const code = resolveCountryCode(countryValue);

  return COUNTRIES.find((country) => country.code === code)?.name ?? '';
}

export function resolveCountryLocations(countryValue: string | null | undefined): SupportedLocationRegion[] {
  const code = resolveCountryCode(countryValue);

  return COUNTRY_LOCATIONS[code] ?? [];
}
