import axios from "axios";
import { IpInfo, Holiday } from "../types/IpInfo";

/**
 * Consultar informació de l'adreça IP des de múltiples API
 * Obtenir les dades básiques + festius
 */

const API = {
  IP: "https://ipapi.co/",
  HOLIDAYS: "https://date.nager.at/api/v3/publicholidays/",
};

export const getIpInfo = async (
  ip: string
): Promise<{ ipInfo: IpInfo; holidays: Holiday[] }> => {
  try {
    // Consulta IP
    const { data } = await axios.get(`${API.IP}${ip}/json/`);

    // Mapeja resposta
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

    // Consulta festius
    let holidays: Holiday[] = [];
    if (ipInfo.countryCode) {
      try {
        const year = new Date().getFullYear();
        const { data: festius } = await axios.get<Holiday[]>(
          `${API.HOLIDAYS}${year}/${ipInfo.countryCode}`
        );

        const today = new Date();

        // Obté els propers festius o els més recents
        holidays = festius
          .filter((h) => new Date(h.date) >= today)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 5);

        if (holidays.length === 0) {
          holidays = festius
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 5);
        }
      } catch (error) {
        console.log("Error consultant festius:", error);
      }
    }

    return { ipInfo, holidays };
  } catch (error: any) {
    // Resposta d'error
    return {
      ipInfo: {
        status: "fail",
        message:
          error.response?.status === 429
            ? "Límit de consultes excedit"
            : error.response?.status === 404
            ? `IP no trobada: ${ip}`
            : "Error consultant IP",
        query: ip,
        country: "",
        countryCode: "",
        city: "",
        lat: 0,
        lon: 0,
        timezone: "",
        isp: "",
      },
      holidays: [],
    };
  }
};
