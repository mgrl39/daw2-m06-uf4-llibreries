import axios from "axios";
import { IpInfo, Holiday, IpapiResponse } from "../types/IpInfo";

/**
 * Consultar informació de l'adreça IP des de múltiples API
 * Obtenir les dades básiques + festius
 */

const IP_API_ENDPOINT = "https://ipapi.co/";
const HOLIDAYS_API_ENDPOINT = "https://date.nager.at/api/v3/publicholidays/";

export const getIpInfo = async (
  ip: string
): Promise<{ ipInfo: IpInfo; holidays: Holiday[] }> => {
  try {
    // Consulta IP
    const ipData = await axios.get<IpapiResponse>(
      `${IP_API_ENDPOINT}${ip}/json/`
    );

    // Adapta respuesta
    const ipInfo: IpInfo = {
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
      isp: ipData.data.org,
      org: ipData.data.org,
      as: ipData.data.asn,
      currency: ipData.data.currency,
      currency_name: ipData.data.currency_name,
      languages: ipData.data.languages,
    };

    // Consulta festivos
    let holidays: Holiday[] = [];
    if (ipInfo.countryCode) {
      try {
        const year = new Date().getFullYear();
        const holidaysData = await axios.get<Holiday[]>(
          `${HOLIDAYS_API_ENDPOINT}${year}/${ipInfo.countryCode}`
        );

        // Filtra próximos/recientes
        const today = new Date();
        holidays = holidaysData.data
          .filter((h) => new Date(h.date) >= today)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 5);

        if (holidays.length === 0) {
          holidays = holidaysData.data
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 5);
        }
      } catch (error) {
        console.log("Error consultando festivos:", error);
      }
    }

    return { ipInfo, holidays };
  } catch (error: any) {
    // Gestión de errores
    const errorResponse: IpInfo = {
      status: "fail",
      message:
        error.response?.status === 429
          ? "Límite de consultas excedido"
          : error.response?.status === 404
          ? `IP no encontrada: ${ip}`
          : "Error consultando IP",
      query: ip,
      country: "",
      countryCode: "",
      city: "",
      lat: 0,
      lon: 0,
      timezone: "",
      isp: "",
    };

    return { ipInfo: errorResponse, holidays: [] };
  }
};
