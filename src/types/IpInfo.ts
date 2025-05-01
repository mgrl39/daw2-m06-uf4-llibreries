/**
 * Información básica de IP
 */
export interface IpInfo {
  query: string;
  status: "success" | "fail";
  message?: string;

  // Datos de ubicación
  city: string;
  country: string;
  countryCode: string;
  region?: string;
  regionName?: string;
  zip?: string;
  lat: number;
  lon: number;

  // Datos adicionales
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
