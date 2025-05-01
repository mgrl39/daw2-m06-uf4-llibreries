import axios from "axios";
import {
  IpApiResponse,
  HolidayInfo,
  CombinedIpInfo,
  IpapiResponse,
} from "../types/IpInfo";

/**
 * Consultar informació de l'adreça IP des de múltiples API
 * Obtenir les dades básiques + festius
 */

export const IP_API_ENDPOINT = "https://ipapi.co/";
export const HOLIDAYS_API_ENDPOINT =
  "https://date.nager.at/api/v3/publicholidays/";

export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {
  try {
    // Obtenció d'informació bàsica de la IP
    const ipData = await axios.get<IpapiResponse>(
      `${IP_API_ENDPOINT}${ip}/json/`,
      { headers: { Accept: "application/json" } }
    );

    // Adaptació de la resposta al nostre format
    const adaptedData: IpApiResponse = {
      status: "success",
      query: ip,
      country: ipData.data.country_name,
      countryCode: ipData.data.country_code,
      region: ipData.data.region_code,
      regionName: ipData.data.region,
      city: ipData.data.city,
      zip: ipData.data.postal,
      lat: ipData.data.latitude,
      lon: ipData.data.longitude,
      timezone: ipData.data.timezone,
      isp: ipData.data.org, // La API utilitza 'org' com ISP
      org: ipData.data.org,
      as: ipData.data.asn,
      currency: ipData.data.currency,
      currency_name: ipData.data.currency_name,
      languages: ipData.data.languages,
    };

    let holidays: HolidayInfo[] = [];

    // Cerca de festius si hi ha codi de país
    if (adaptedData.countryCode) {
      try {
        const currentYear = new Date().getFullYear();
        const holidaysResponse = await axios.get<HolidayInfo[]>(
          `${HOLIDAYS_API_ENDPOINT}${currentYear}/${adaptedData.countryCode}`,
          { headers: { Accept: "application/json" } }
        );

        if (holidaysResponse.data) {
          const today = new Date();

          // Intenta obtenir els propers festius
          holidays = holidaysResponse.data
            .filter((h) => new Date(h.date) >= today)
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 5);

          // Si no hi ha propers festius, mostra els més recents
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
        console.log("Error obtenint dades de festius:", error);
      }
    }

    return {
      ipApi: adaptedData,
      holidays: holidays,
    };
  } catch (error: any) {
    console.error(`Error IP ${ip}:`, error);

    // Resposta per casos d'error
    const errorResponse: IpApiResponse = {
      status: "fail",
      message:
        error.response?.status === 429
          ? "Límit de consultes excedit. Torna a provar més tard."
          : error.response?.status === 404
          ? `IP no trobada: ${ip}`
          : "No s'ha pogut obtenir informació de la IP",
      query: ip,
      country: "",
      countryCode: "",
      city: "",
      lat: 0,
      lon: 0,
      timezone: "",
      isp: "",
    };

    return {
      ipApi: errorResponse,
      holidays: [],
    };
  }
};
