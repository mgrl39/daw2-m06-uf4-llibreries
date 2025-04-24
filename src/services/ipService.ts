import axios from 'axios';
import { IpApiResponse, ShodanResponse, CombinedIpInfo } from '../types/IpInfo';

export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {
    try {
        const [ipApiResponse, shodanResponse] = await Promise.all([
            axios.get<IpApiResponse>(`http://ip-api.com/json/${ip}`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'IP Address Mapper/1.0'
                }
            }),
            axios.get<ShodanResponse>(`https://internetdb.shodan.io/${ip}`).catch(() => null),
        ]);

        return {
            ipApi: ipApiResponse.data,
            shodan: shodanResponse?.data || {
                cpes: [],
                hostnames: [],
                ports: [],
                tags: [],
                vulns: []
            }
        };
    } catch (error: any) {
        console.error('Error al obtener información de IP:', error);
        throw error;
    }
}; 