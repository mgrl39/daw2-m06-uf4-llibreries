const Map = { { IpInfo }: MapProps} {
    const defaultPosition : [number, number] = [40, 0];
    const position: [number, number] = ipInfo ? [IpInfo.ipApi.lat, IpInfo.ipApi.lon] : defaultPosition;

    return (
        <MapContainer>

        </MapContainer>
    )
}