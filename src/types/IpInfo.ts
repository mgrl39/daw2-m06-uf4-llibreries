/**
 * Informació bàsica d'IP
 */
export interface IpInfo {
  query: string;
  status: "success" | "fail";
  message?: string;

  // Dades d'ubicació
  city: string;
  country: string;
  countryCode: string;
  region?: string;
  regionName?: string;
  zip?: string;
  lat: number;
  lon: number;

  // Dades addicionals
  timezone: string;
  isp: string;
  org?: string;
  as?: string;
  currency?: string;
  currency_name?: string;
  languages?: string;
}

/**
 * Informació de festius
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
 * Props unificats per components
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
