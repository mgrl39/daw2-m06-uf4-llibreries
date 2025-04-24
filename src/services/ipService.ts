import axios from 'axios';
import { IpApiResponse, ShodanResponse, CombinedIpInfo } from '../types/IpInfo';

/**
 * Consultar informació de l'adreça IP des de múltiples API
 */
export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {

  const emptyData: ShodanResponse = { cpes: [], hostnames: [], ports: [], tags: [], vulns: [] };
  
  // Obtenir les dades básiques + dades secundaries
  try {
    const ipData = await axios.get<IpApiResponse>(
      `http://ip-api.com/json/${ip}`, 
      { headers: { 'Accept': 'application/json' }}
    );
    
    // Intentar obtenir dades secundaries
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