import axios from 'axios';
import { IpApiResponse, ShodanResponse, CombinedIpInfo } from '../types/IpInfo';

/**
 * Consulta información de IP desde múltiples APIs
 */
export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {
  // Valores por defecto
  const emptyData: ShodanResponse = { cpes: [], hostnames: [], ports: [], tags: [], vulns: [] };
  
  try {
    // Obtener datos básicos
    const ipData = await axios.get<IpApiResponse>(
      `http://ip-api.com/json/${ip}`, 
      { headers: { 'Accept': 'application/json' }}
    );
    
    // Intentar obtener datos secundarios
    let shodanData = emptyData;
    try {
      const shodan = await axios.get<ShodanResponse>(`https://internetdb.shodan.io/${ip}`);
      if (shodan.data) shodanData = shodan.data;
    } catch {}
    
    return { ipApi: ipData.data, shodan: shodanData };
  } catch (error) {
    console.error(`Error IP ${ip}:`, error);
    throw error;
  }
}; 