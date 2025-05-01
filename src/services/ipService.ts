import axios from "axios";
import { IpInfo, Holiday } from "../types/IpInfo";

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
    // Consulta información de IP
    const response = await axios.get(`${IP_API_ENDPOINT}${ip}/json/`);
    const data = response.data;

    // Mapea la respuesta a nuestro formato interno
    const ipInfo: IpInfo = {
      status: "success",
      query: ip,
      country: data.country_name,
      countryCode: data.country_code,
      region: data.region_code,
      regionName: data.region,
      city: data.city,
      zip: data.postal,
      lat: data.latitude,
      lon: data.longitude,
      timezone: data.timezone,
      isp: data.org,
      org: data.org,
      as: data.asn,
      currency: data.currency,
      currency_name: data.currency_name,
      languages: data.languages,
    };

    // Consulta festivos
    let holidays: Holiday[] = [];
    if (ipInfo.countryCode) {
      try {
        const year = new Date().getFullYear();
        const holidaysResponse = await axios.get<Holiday[]>(
          `${HOLIDAYS_API_ENDPOINT}${year}/${ipInfo.countryCode}`
        );

        // Filtra próximos/recientes
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
    // Respuesta en caso de error
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
