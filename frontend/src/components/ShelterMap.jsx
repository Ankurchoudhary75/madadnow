import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useRef } from "react";

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom animated marker for live tracking
const userIcon = new L.DivIcon({
    html: `
        <div style="
            width: 24px; 
            height: 24px; 
            background: #3b82f6; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        ">
        </div>
        <style>
            @keyframes pulse-ring {
                0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
                100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
            }
            .leaflet-marker-icon.live-tracking-marker {
                transition: transform 0.5s ease-out !important;
            }
        </style>
    `,
    className: 'live-tracking-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

// Category Markers
const createMarker = (color) => new L.DivIcon({
    html: `<div style="width: 20px; height: 20px; background: ${color}; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

const icons = {
    shelters: createMarker('#6366f1'), // Indigo
    police: createMarker('#3b82f6'),   // Blue
    hospitals: createMarker('#ef4444'),// Red
    ngos: createMarker('#f59e0b'),     // Amber
};

// 🔁 Recenter map when user location changes or route active
function MapController({ lat, lng, routeBounds }) {
    const map = useMap();
    useEffect(() => {
        if (routeBounds) {
            map.fitBounds(routeBounds, { padding: [50, 50] });
        } else {
            map.setView([lat, lng], map.getZoom());
        }
    }, [lat, lng, map, routeBounds]);
    
    // Fix split/tiling issue when map becomes visible
    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 200);
    }, [map]);
    
    return null;
}

export default function ShelterMap({ shelters, userLocation, activeDestination, onClearRoute, category = "shelters" }) {
    const [routePath, setRoutePath] = useState([]);
    const [routeBounds, setRouteBounds] = useState(null);
    const [simulating, setSimulating] = useState(false);
    const [simLocation, setSimLocation] = useState(null);
    const simRef = useRef(null);

    // Fetch Route when activeDestination changes
    useEffect(() => {
        if (!activeDestination) {
            setRoutePath([]);
            setRouteBounds(null);
            setSimulating(false);
            setSimLocation(null);
            if (simRef.current) clearInterval(simRef.current);
            return;
        }

        const fetchRoute = async () => {
            try {
                const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${activeDestination.lng},${activeDestination.lat}?overview=full&geometries=geojson`);
                const data = await res.json();
                
                if (data.routes && data.routes.length > 0) {
                    // OSRM returns [lon, lat], Leaflet needs [lat, lon]
                    const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                    setRoutePath(coords);
                    
                    // Calculate bounds
                    const bounds = L.latLngBounds(coords);
                    setRouteBounds(bounds);
                }
            } catch (err) {
                console.error("Failed to fetch route:", err);
            }
        };

        fetchRoute();
    }, [activeDestination, userLocation.lat, userLocation.lng]);

    // Demo Simulation Mode
    const startSimulation = () => {
        if (routePath.length === 0) return;
        setSimulating(true);
        let index = 0;
        
        if (simRef.current) clearInterval(simRef.current);
        
        simRef.current = setInterval(() => {
            if (index < routePath.length) {
                setSimLocation({ lat: routePath[index][0], lng: routePath[index][1] });
                index++;
            } else {
                clearInterval(simRef.current);
                setSimulating(false);
            }
        }, 300); // move every 300ms
    };

    const displayLocation = simulating && simLocation ? simLocation : userLocation;

    return (
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
            
            {/* Top Bar overlay for active route */}
            {activeDestination && (
                <div style={{
                    position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", 
                    zIndex: 1000, background: "rgba(0,0,0,0.8)", padding: "10px 20px", 
                    borderRadius: "30px", display: "flex", gap: "10px", alignItems: "center",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)"
                }}>
                    <span style={{ fontWeight: "bold" }}>Navigating to: {activeDestination.name}</span>
                    <button 
                        onClick={startSimulation}
                        disabled={simulating || routePath.length === 0}
                        style={{ background: "#3b82f6", padding: "4px 12px", borderRadius: "15px", fontSize: "12px", opacity: simulating ? 0.5 : 1 }}
                    >
                        {simulating ? "Simulating..." : "Start Demo"}
                    </button>
                    <button 
                        onClick={onClearRoute}
                        style={{ background: "#ef4444", padding: "4px 12px", borderRadius: "15px", fontSize: "12px" }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            <MapContainer
                center={[displayLocation.lat, displayLocation.lng]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController lat={displayLocation.lat} lng={displayLocation.lng} routeBounds={routeBounds} />

                {/* Drawn Route */}
                {routePath.length > 0 && (
                    <Polyline 
                        positions={routePath} 
                        pathOptions={{ color: '#3b82f6', weight: 6, opacity: 0.8 }} 
                    />
                )}

                {/* 🔵 Live Animated User Marker */}
                <Marker 
                    position={[displayLocation.lat, displayLocation.lng]} 
                    icon={userIcon}
                >
                    <Popup>Your Live Location</Popup>
                </Marker>

                {/* Infrastructure Markers */}
                {shelters.map((s) => (
                    <Marker key={s.id} position={[s.latitude, s.longitude]} icon={icons[category] || icons.shelters}>
                        <Popup>
                            <b>{s.name}</b>
                            <br />
                            {s.capacity && s.capacity !== "N/A" && `Capacity: ${s.capacity}`}
                            <br />
                            <button
                                onClick={() => {
                                    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${s.latitude},${s.longitude}`;
                                    window.open(url, "_blank");
                                }}
                                style={{
                                    marginTop: "8px", padding: "6px 12px", background: "#2563eb",
                                    color: "white", borderRadius: "6px", border: "none", cursor: "pointer"
                                }}
                            >
                                Open in Google Maps
                            </button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}