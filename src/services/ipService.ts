import axios from "axios";
import { IpApiResponse, ShodanResponse, CombinedIpInfo } from "../types/IpInfo";

/**
 * Consultar informació de l'adreça IP des de múltiples API
 * Obtenir les dades básiques + dades secundaries
 * Intentar obtenir dades secundaries
 */

export const IP_API_ENDPOINT: string = `http://ip-api.com/json/`;
export const SHODAN_API_ENDPOINT: string = `https://internetdb.shodan.io/`;

export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {
  try {
    const ipData = await axios.get<IpApiResponse>(IP_API_ENDPOINT + ip, {
      headers: { Accept: "application/json" },
    });

    let shodanData: ShodanResponse = {
      cpes: [],
      hostnames: [],
      ports: [],
      tags: [],
      vulns: [],
    };
    try {
      const shodan = await axios.get<ShodanResponse>(SHODAN_API_ENDPOINT + ip);
      if (shodan.data) shodanData = shodan.data;
      /*
       * TODO: DO SOMETHING WITH THIS CATCH
       */
    } catch {}
    return { ipApi: ipData.data, shodan: shodanData };
  } catch (error) {
    console.error(`Error IP ${ip}:`, error);
    throw error;
  }
};
