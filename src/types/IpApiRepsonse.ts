/*
{
    "status": "success",
    "country": "Spain",
    "countryCode": "ES",
    "region": "CT",
    "regionName": "Catalonia",
    "city": "Barcelona",
    "zip": "08028",
    "lat": 41.383,
    "lon": 2.1181,
    "timezone": "Europe/Madrid",
    "isp": "Digi Spain Telecom S.L.U.",
    "org": "",
    "as": "AS57269 DIGI SPAIN TELECOM S.L.",
    "query": "188.26.220.221"
}
*/
export interface IpApiResponse {
    status: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezome: string;
    isp: string;
    org: string;
    as: string;
    query: string;
}