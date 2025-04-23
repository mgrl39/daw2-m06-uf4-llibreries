import axios from 'axios';
import { IpApiResponse, ShodanResponse, CombinedIpInfo, AbuseIPDBResponse, IPQualityScoreResponse } from '../types/IpInfo';
import { fetchWithCorsProxy } from './corsProxy';

const getAbuseIPDBInfo = async (ip: string): Promise<AbuseIPDBResponse | null> => {
    try {
        const response = await axios.get<AbuseIPDBResponse>(
            `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Key': 'none' // Using public endpoint
                }
            }
        );
        return response.data;
    } catch (error) {
        console.warn('AbuseIPDB API failed:', error);
        return null;
    }
};

const getIPQualityScore = async (ip: string): Promise<IPQualityScoreResponse | null> => {
    try {
        const response = await axios.get<IPQualityScoreResponse>(
            `https://ipqualityscore.com/api/json/ip/${ip}?strictness=0&allow_public_access_points=true`
        );
        return response.data;
    } catch (error) {
        console.warn('IPQualityScore API failed:', error);
        return null;
    }
};

export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {
    try {
        // Using the CORS-friendly endpoint for ip-api.com and trying additional APIs
        const [ipApiResponse, shodanResponse, abuseResponse, ipQualityResponse] = await Promise.all([
            axios.get<IpApiResponse>(`http://ip-api.com/json/${ip}`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'IP Address Mapper/1.0'
                }
            }),
            axios.get<ShodanResponse>(`https://internetdb.shodan.io/${ip}`).catch(() => null),
            getAbuseIPDBInfo(ip),
            getIPQualityScore(ip)
        ]);

        return {
            ipApi: ipApiResponse.data,
            shodan: shodanResponse?.data || {
                cpes: [],
                hostnames: [],
                ports: [],
                tags: [],
                vulns: []
            },
            ...(abuseResponse && { abuseIPDB: abuseResponse }),
            ...(ipQualityResponse && { ipQualityScore: ipQualityResponse })
        };
    } catch (error: any) {
        // If ip-api.com fails due to CORS, try using a CORS proxy
        if (error.response && error.response.status === 403) {
            try {
                // Try to get IP data through CORS proxy
                const ipApiData = await fetchWithCorsProxy(`http://ip-api.com/json/${ip}`);
                
                // Try other APIs
                const [shodanResponse, abuseResponse, ipQualityResponse] = await Promise.all([
                    axios.get<ShodanResponse>(`https://internetdb.shodan.io/${ip}`).catch(() => null),
                    getAbuseIPDBInfo(ip),
                    getIPQualityScore(ip)
                ]);

                return {
                    ipApi: ipApiData,
                    shodan: shodanResponse?.data || {
                        cpes: [],
                        hostnames: [],
                        ports: [],
                        tags: [],
                        vulns: []
                    },
                    ...(abuseResponse && { abuseIPDB: abuseResponse }),
                    ...(ipQualityResponse && { ipQualityScore: ipQualityResponse })
                };
            } catch (proxyError) {
                console.error('Error fetching IP information through CORS proxy:', proxyError);
                throw proxyError;
            }
        }

        // If it's a Shodan 404, continue with IP-API data only
        if (error.response && error.response.status === 404 && error.config.url.includes('shodan')) {
            try {
                const ipApiData = await fetchWithCorsProxy(`http://ip-api.com/json/${ip}`);
                return {
                    ipApi: ipApiData,
                    shodan: {
                        cpes: [],
                        hostnames: [],
                        ports: [],
                        tags: [],
                        vulns: []
                    }
                };
            } catch (proxyError) {
                console.error('Error fetching IP information through CORS proxy:', proxyError);
                throw proxyError;
            }
        }

        console.error('Error fetching IP information:', error);
        throw error;
    }
}; 