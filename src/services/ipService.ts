import axios from "axios";
import { IpInfo, Holiday } from "../types/IpInfo";

/**
 * Consultar informació de l'adreça IP des de múltiples API
 * Obtenir les dades básiques + festius
 */

const API: { IP: string; HOLIDAYS: string } = {
  IP: "https://ipapi.co/",
  HOLIDAYS: "https://date.nager.at/api/v3/publicholidays/",
};

/**
 * Per a no tenir problemes amb els errors, agafem el codi d'error
 * i es manipula segons el nostre criteri. D'aquesta manera,
 * no he de crear-ne una lògica de tractament d'errors.
 */
export const getIpInfo = async (
  ip: string
): Promise<{ ipInfo: IpInfo; holidays: Holiday[] }> => {
  try {
    // Consulta IP
    const { data }: { data: any } = await axios.get(`${API.IP}${ip}/json/`);

    // Mapejar resposta
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
        // 1. Obtenim festius de l'any actual pel país
        const any: number = new Date().getFullYear();
        const resposta = await axios.get<Holiday[]>(
          `${API.HOLIDAYS}${any}/${ipInfo.countryCode}`
        );
        const totsFestius: Holiday[] = resposta.data;
        const avui: Date = new Date();

        // 2. Separem festius en futurs i passats
        const festiusFuturs: Holiday[] = [];
        const festiusPassats: Holiday[] = [];

        // Classifiquem cada festiu
        totsFestius.forEach((festiu: Holiday) => {
          const dataFestiu = new Date(festiu.date);
          if (dataFestiu >= avui) festiusFuturs.push(festiu);
          else festiusPassats.push(festiu);
        });

        // 3. Decidim quins mostrar
        if (festiusFuturs.length > 0) {
          // Si hi ha festius futurs, ordenem per data ascendent (els més propers primer)
          festiusFuturs.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          holidays = festiusFuturs.slice(0, 5); // Agafem els 5 primers
        } else {
          // Si no hi ha festius futurs, mostrem els 5 passats més recents
          festiusPassats.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          holidays = festiusPassats.slice(0, 5); // Agafem els 5 primers
        }
      } catch (error: any) {
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
          error.response?.status == 429
            ? "Límit de consultes excedit"
            : error.response?.status == 404
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
