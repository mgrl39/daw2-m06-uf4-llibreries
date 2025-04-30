import axios from "axios";
import {
  IpApiResponse,
  ShodanResponse,
  CombinedIpInfo,
  HolidayInfo,
} from "../types/IpInfo";

/**
 * Consultar informació de l'adreça IP des de múltiples API
 * Obtenir les dades básiques + dades secundaries
 * Intentar obtenir dades secundaries
 */

export const IP_API_ENDPOINT: string = `http://ip-api.com/json/`;
export const SHODAN_API_ENDPOINT: string = `https://internetdb.shodan.io/`;
export const HOLIDAYS_API_ENDPOINT: string = `https://date.nager.at/api/v3/publicholidays/`;

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

    let holidays: HolidayInfo[] = [];

    // Solo buscar festivos si la respuesta es válida y tiene código de país
    if (ipData.data.status === "success" && ipData.data.countryCode) {
      try {
        // Obtener festivos del año actual
        const currentYear = new Date().getFullYear();
        const holidaysResponse = await axios.get<HolidayInfo[]>(
          `${HOLIDAYS_API_ENDPOINT}${currentYear}/${ipData.data.countryCode}`,
          { headers: { Accept: "application/json" } }
        );

        if (holidaysResponse.data) {
          // Filtrar festivos próximos
          const today = new Date();
          holidays = holidaysResponse.data
            .filter((h) => new Date(h.date) >= today)
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 5); // Mostrar solo los 5 próximos

          // Si no hay festivos próximos, mostrar los últimos 5 del año
          if (holidays.length === 0) {
            holidays = holidaysResponse.data
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .slice(0, 5);
          }
        }
      } catch (error) {
        console.log("Error fetching holidays data:", error);
      }
    }

    return {
      ipApi: ipData.data,
      shodan: shodanData,
      holidays: holidays,
    };
  } catch (error) {
    console.error(`Error IP ${ip}:`, error);
    throw error;
  }
};
