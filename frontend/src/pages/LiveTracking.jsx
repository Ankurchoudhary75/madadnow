import { useEffect, useState } from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LiveTracking() {

    const [locations, setLocations] = useState([]);

    useEffect(() => {

        const fetchLocations = async () => {

            try {

                const res = await fetch(
                    "/api/emergency/live-locations"
                );

                const data = await res.json();

                setLocations(data);

            } catch (err) {

                console.error(err);
            }
        };

        fetchLocations();

        const interval = setInterval(fetchLocations, 3000);

        return () => clearInterval(interval);

    }, []);

    return (

        <div className="h-screen w-full">

            <MapContainer
                center={[28.61, 77.20]}
                zoom={13}
                className="h-full w-full"
            >

                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map((loc, index) => (

                    <Marker
                        key={index}
                        position={[
                            loc.latitude,
                            loc.longitude
                        ]}
                    >

                        <Popup>

                            🚨 User Live Location

                            <br />

                            {loc.latitude},
                            {loc.longitude}

                        </Popup>

                    </Marker>

                ))}

            </MapContainer>

        </div>
    );
}