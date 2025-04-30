/**
 * Datos básicos IP-API (adaptados para ipapi.co)
 */
export interface IpApiResponse {
  status: string;
  message?: string;
  country: string;
  countryCode: string;
  region?: string;
  regionName?: string;
  city: string;
  zip?: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org?: string;
  as?: string;
  query: string;

  // ipapi.co fields (used internally)
  country_name?: string;
  country_code?: string;
  region_code?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  asn?: string;
}

/**
 * Dades Shodan.
 * La api te un camp IP pero no m'interessa...
 */

/**
 * Datos de días festivos
 */
export interface HolidayInfo {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

/**
 * Resposta combinada
 */
export interface CombinedIpInfo {
  ipApi: IpApiResponse;
  holidays: HolidayInfo[];
}

export type Props = {
  onSearch: (ip: string) => void;
  isLoading: boolean;
};
