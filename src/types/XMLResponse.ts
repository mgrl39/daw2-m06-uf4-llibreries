/*
<result>
    <success>true</success>
    <ip>188.26.220.221</ip>
    <type>IPv4</type>
    <country>
        <code>ES</code>
        <name>Spain</name>
    </country>
    <region>Barcelona</region>
    <city>Barcelona</city>
    <location></location>
    <timeZone>Europe/Madrid</timeZone>
    <asn>
        <number>57269</number>
        <name>Digi Spain Telecom S.l.</name>
        <network>188.26.192.0/19</network>
    </asn>
</result>
*/
export interface XMLResponse {
    success: boolean;
    ip: string;
    type: string;
    country: {
        code: string;
        name: string;
    };
    region: string;
    city: string;
    location: string;
    timezone: string;
    asn: {
        number: number;
        name: string;
        network: string;
    };
}