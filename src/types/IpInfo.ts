/**
 * Datos básicos IP-API
 */
export interface IpApiResponse {
  status: string;
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
}

/**
 * Dades Shodan.
 * La api te un camp IP pero no m'interessa...
 */
export interface ShodanResponse {
  cpes: string[];
  hostnames: string[];
  ports: number[];
  tags: string[];
  vulns: string[];
}

/**
 * Resposta combinada
 */
export interface CombinedIpInfo {
  ipApi: IpApiResponse;
  shodan: ShodanResponse;
}

export type Props = {
  onSearch: (ip: string) => void;
  isLoading: boolean;
};