import axios from 'axios';
import { IpApiResponse, ShodanResponse, CombinedIpInfo } from '../types/IpInfo';

/**
 * Consulta información de IP desde múltiples APIs
 */
export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {
  // Datos Shodan por defecto
  const defaultShodan: ShodanResponse = { 
    cpes: [], hostnames: [], ports: [], tags: [], vulns: [] 
  };

  try {
    // Obtener datos básicos de IP-API (principal)
    const ipApiResp = await axios.get<IpApiResponse>(
      `http://ip-api.com/json/${ip}`,
      { headers: { 'Accept': 'application/json' }}
    );
    
    // Intentar obtener datos de Shodan (secundario, puede fallar)
    let shodanData = defaultShodan;
    try {
      const shodanResp = await axios.get<ShodanResponse>(
        `https://internetdb.shodan.io/${ip}`
      );
      shodanData = shodanResp.data || defaultShodan;
    } catch {
      // Silenciar error de Shodan - es opcional
    }
    
    return { 
      ipApi: ipApiResp.data, 
      shodan: shodanData 
    };
  } catch (error) {
    console.error(`Error al consultar IP ${ip}:`, error);
    throw error;
  }
}; 