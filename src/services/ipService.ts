import axios from "axios";
import { IpApiResponse, ShodanResponse, CombinedIpInfo } from "../types/IpInfo";

/**
 * Consultar informació de l'adreça IP des de múltiples API
 * Obtenir les dades básiques + dades secundaries
 * Intentar obtenir dades secundaries
 */
export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {
  const emptyData: ShodanResponse = {
    cpes: [],
    hostnames: [],
    ports: [],
    tags: [],
    vulns: [],
  };

  try {
    const ipData = await axios.get<IpApiResponse>(
      `http://ip-api.com/json/${ip}`,
      { headers: { Accept: "application/json" } }
    );                  
    let shodanData: ShodanResponse = emptyData;
    try {
      const shodan = await axios.get<ShodanResponse>(
        `https://internetdb.shodan.io/${ip}`
      );
      if (shodan.data) shodanData = shodan.data;
    } catch {}

    return { ipApi: ipData.data, shodan: shodanData };
  } catch (error) {
    console.error(`Error IP ${ip}:`, error);
    throw error;
  }
};
