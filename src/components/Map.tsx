import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
//const Map = { { IpInfo }: MapProps} {
    const defaultPosition : [number, number] = [40, 0];
//    const position: [number, number] = ipInfo ? [IpInfo.ipApi.lat, IpInfo.ipApi.lon] : defaultPosition;

    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '500px', width: '100%'}}    
        >
             <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
        </MapContainer>
    )
}