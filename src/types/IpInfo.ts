/**
 * API de IP - Lo que recibimos en bruto
 */
export interface IpapiResponse {
  ip: string;
  city: string;
  region: string;
  region_code: string;
  country_code: string;
  country_name: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currency: string;
  currency_name: string;
  languages: string;
  asn: string;
  org: string;
}

/**
 * Información de IP procesada para uso interno
 */
export interface IpInfo {
  query: string;
  status: "success" | "fail";
  message?: string;
  city: string;
  country: string;
  countryCode: string;
  region?: string;
  regionName?: string;
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
 * Información de festivos
 */
export interface Holiday {
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
 * Props unificados para componentes
 */
export interface ComponentProps {
  ipInfo?: IpInfo;
  holidays?: Holiday[];
  country?: string;
  isVisible?: boolean;
  isLoading?: boolean;
  onSearch?: (ip: string) => void;
  styleIdx?: number;
}
