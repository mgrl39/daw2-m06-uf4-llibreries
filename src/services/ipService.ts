import axios from 'axios';
import { IpApiResponse, ShodanResponse, CombinedIpInfo } from '../types/IpInfo';

// Consulta información de IP de múltiples fuentes
export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {
    try {
        // Obtener datos básicos de IP-API
        const ipApiResponse = await axios.get<IpApiResponse>(`http://ip-api.com/json/${ip}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'IP Address Mapper/1.0'
            }
        });
        
        // Datos default de Shodan
        let shodanData: ShodanResponse = { cpes: [], hostnames: [], ports: [], tags: [], vulns: [] };
        
        try {
            // Intentar obtener datos adicionales de Shodan
            const shodanResponse = await axios.get<ShodanResponse>(`https://internetdb.shodan.io/${ip}`);
            shodanData = shodanResponse.data || shodanData;
        } catch {
            console.log('Shodan: sin datos para esta IP');
        }
        
        return { ipApi: ipApiResponse.data, shodan: shodanData };
    } catch (error) {
        console.error('Error al obtener información de IP:', error);
        throw error;
    }
}; 