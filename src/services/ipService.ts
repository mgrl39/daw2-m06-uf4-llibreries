import axios from "axios";
import { IpApiResponse, HolidayInfo, CombinedIpInfo } from "../types/IpInfo";

/**
 * Consultar informació de l'adreça IP des de múltiples API
 * Obtenir les dades básiques + festius
 */

export const IP_API_ENDPOINT: string = `https://ipapi.co/`;
export const HOLIDAYS_API_ENDPOINT: string = `https://date.nager.at/api/v3/publicholidays/`;

export const getIpInfo = async (ip: string): Promise<CombinedIpInfo> => {
  try {
    // Obtener información básica de la IP
    const ipData = await axios.get<IpApiResponse>(
      `${IP_API_ENDPOINT}${ip}/json/`,
      {
        headers: { Accept: "application/json" },
      }
    );

    // Adapt response to match our expected format
    const adaptedData: IpApiResponse = {
      status: "success",
      query: ip,
      country: ipData.data.country_name || "",
      countryCode: ipData.data.country_code || "",
      region: ipData.data.region_code || "",
      regionName: ipData.data.region || "",
      city: ipData.data.city || "",
      zip: ipData.data.postal || "",
      lat: ipData.data.latitude || 0,
      lon: ipData.data.longitude || 0,
      timezone: ipData.data.timezone || "",
      isp: ipData.data.org || "",
      org: ipData.data.org || "",
      as: ipData.data.asn || "",
    };

    let holidays: HolidayInfo[] = [];

    // Solo buscar festivos si tiene código de país
    if (adaptedData.countryCode) {
      try {
        // Obtener festivos del año actual
        const currentYear = new Date().getFullYear();
        const holidaysResponse = await axios.get<HolidayInfo[]>(
          `${HOLIDAYS_API_ENDPOINT}${currentYear}/${adaptedData.countryCode}`,
          { headers: { Accept: "application/json" } }
        );

        if (holidaysResponse.data) {
          // Procesamiento de festivos (sin cambios)
          const today = new Date();
          holidays = holidaysResponse.data
            .filter((h) => new Date(h.date) >= today)
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 5);

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
      ipApi: adaptedData,
      holidays: holidays,
    };
  } catch (error: any) {
    console.error(`Error IP ${ip}:`, error);
    // Create a fallback response for error case
    const errorResponse: IpApiResponse = {
      status: "fail",
      message:
        error.response?.status === 429
          ? "Rate limit exceeded. Try again later."
          : error.response?.status === 404
          ? `IP not found: ${ip}`
          : "Could not get IP information",
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
