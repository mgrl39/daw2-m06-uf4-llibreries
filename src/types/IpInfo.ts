/**
 * Dades rebudes directament de l'API ipapi.co
 */
export interface IpapiResponse {
  ip: string;
  city: string;
  region: string;
  region_code: string;
  country_code: string;
  country_code_iso3: string;
  country_name: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  asn: string;
  org: string;
}

/**
 * Resposta adaptada d'IP
 */
export interface IpApiResponse {
  status: string;
  message?: string;
  query: string;
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
  currency?: string;
  currency_name?: string;
  languages?: string;
}

/**
 * Dades de dies festius
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
 * Dades combinades de l'IP i els dies festius
 */
export interface CombinedIpInfo {
  ipApi: IpApiResponse;
  holidays: HolidayInfo[];
}

/**
 * Props per al component IpSearch
 */
export type Props = {
  onSearch: (ip: string) => void;
  isLoading: boolean;
};
