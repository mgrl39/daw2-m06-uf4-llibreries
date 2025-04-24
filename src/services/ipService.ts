import axios from 'axios';
import { IpApiResponse, ShodanResponse, CombinedIpInfo } from '../types/IpInfo';

export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {
    try {
        // Primero obtenemos la información de IP-API que es más estable
        const ipApiResponse = await axios.get<IpApiResponse>(`http://ip-api.com/json/${ip}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'IP Address Mapper/1.0'
            }
        });

        // Luego intentamos obtener la información de Shodan
        let shodanData: ShodanResponse = {
            cpes: [],
            hostnames: [],
            ports: [],
            tags: [],
            vulns: []
        };

        try {
            const shodanResponse = await axios.get<ShodanResponse>(`https://internetdb.shodan.io/${ip}`);
            if (shodanResponse.data) {
                shodanData = shodanResponse.data;
            }
        } catch (shodanError) {
            // Si Shodan falla, solo registramos el error pero seguimos usando los datos de IP-API
            console.log('Shodan API no tiene datos para esta IP');
        }

        return {
            ipApi: ipApiResponse.data,
            shodan: shodanData
        };
    } catch (error: any) {
        console.error('Error al obtener información de IP:', error);
        throw error;
    }
}; 