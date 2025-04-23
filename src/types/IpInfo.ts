export interface IpApiResponse {
    status: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
    org: string;
    as: string;
    query: string;
}

export interface ShodanResponse {
    cpes: string[];
    hostnames: string[];
    ports: number[];
    tags: string[];
    vulns: string[];
}

export interface AbuseIPDBResponse {
    data: {
        abuseConfidenceScore: number;
        totalReports?: number;
        lastReportedAt?: string;
    };
}

export interface IPQualityScoreResponse {
    proxy: boolean;
    vpn: boolean;
    tor: boolean;
    fraud_score: number;
    is_crawler: boolean;
    recent_abuse: boolean;
    bot_status: boolean;
}

export interface CombinedIpInfo {
    ipApi: IpApiResponse;
    shodan: ShodanResponse;
    abuseIPDB?: AbuseIPDBResponse;
    ipQualityScore?: IPQualityScoreResponse;
} 