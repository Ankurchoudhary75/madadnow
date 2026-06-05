import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Crosshair, Navigation, Activity, Users, Loader2, Home, Mic, Zap, AlertTriangle, BarChart2 } from "lucide-react";

// --- COLORS FOR MULTI-TRACKING ---
const ROUTE_COLORS = [
    '#f59e0b', // Amber
    '#a855f7', // Purple
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#84cc16'  // Lime
];

// --- CUSTOM LEAFLET ICONS ---
const createCustomIcon = (color) => L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px ${color}; animation: pulse 2s infinite;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const adminIcon = createCustomIcon('#3b82f6');    // Blue
const emergencyIcon = createCustomIcon('#ef4444'); // Red
const criticalIcon = createCustomIcon('#dc2626');  // Dark Red (High Pulse)
const shelterIcon = createCustomIcon('#10b981');   // Emerald

// Helper to auto-fit map bounds
function MapBoundsUpdater({ routes, adminLocation }) {
    const map = useMap();
    useEffect(() => {
        if (!adminLocation) return;
        
        const bounds = L.latLngBounds();
        bounds.extend([adminLocation.lat, adminLocation.lng]);
        
        let hasRoutes = false;
        Object.values(routes).forEach(route => {
            if (route.polyline && route.polyline.length > 0) {
                route.polyline.forEach(coord => bounds.extend(coord));
                hasRoutes = true;
            }
        });

        if (hasRoutes) {
            map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
        }
    }, [routes, adminLocation, map]);
    return null;
}

export default function Admin() {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [shelters, setShelters] = useState([]);
    const [adminLocation, setAdminLocation] = useState(null);
    
    // Multi-user tracking state: Object mapping incident key -> { incident, color, polyline, distance, duration }
    const [trackedData, setTrackedData] = useState({});

    // Generate unique key for an incident based on coords (or index if provided from backend)
    const getIncidentKey = (loc) => `${loc.latitude}-${loc.longitude}`;

    // Get Admin's Live Location
    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => setAdminLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.error("Admin Geolocation Error:", err),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    // Fetch Live Emergencies & Shelters
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch("/api/emergency/live-locations");
                const data = await res.json();
                if (Array.isArray(data)) setLocations(data);
            } catch (err) {
                console.error("LIVE LOCATION ERROR:", err);
            }
        };

        const fetchShelters = async () => {
            try {
                const res = await fetch("/api/shelters/nearest?tenantId=1&latitude=28.61&longitude=77.20");
                const data = await res.json();
                if (Array.isArray(data)) setShelters(data);
            } catch (err) {
                console.error("SHELTER ERROR:", err);
            }
        };

        fetchLocations();
        fetchShelters();
        const interval = setInterval(fetchLocations, 3000);
        return () => clearInterval(interval);
    }, []);

    // Fetch Best Paths (OSRM) for ALL tracked incidents
    useEffect(() => {
        const fetchRoutes = async () => {
            if (!adminLocation || Object.keys(trackedData).length === 0) return;
            
            const updatedData = { ...trackedData };
            
            await Promise.all(Object.entries(updatedData).map(async ([key, data]) => {
                const url = `https://router.project-osrm.org/route/v1/driving/${adminLocation.lng},${adminLocation.lat};${data.incident.longitude},${data.incident.latitude}?overview=full&geometries=geojson`;
                try {
                    const res = await fetch(url);
                    const result = await res.json();
                    if (result.routes && result.routes[0]) {
                        const route = result.routes[0];
                        updatedData[key].polyline = route.geometry.coordinates.map(c => [c[1], c[0]]);
                        updatedData[key].distance = (route.distance / 1000).toFixed(2); // km
                        updatedData[key].duration = Math.ceil(route.duration / 60); // mins
                    }
                } catch (err) {
                    console.error("OSRM Fetch Error:", err);
                }
            }));
            
            setTrackedData(updatedData);
        };

        fetchRoutes();
        // Re-fetch routes every 10 seconds to update live
        const routeInterval = setInterval(fetchRoutes, 10000);
        return () => clearInterval(routeInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminLocation, Object.keys(trackedData).join(",")]);

    // Handle tracking toggle
    const handleTrackToggle = (loc, index) => {
        const key = getIncidentKey(loc);
        setTrackedData(prev => {
            const newData = { ...prev };
            if (newData[key]) {
                // Untrack
                delete newData[key];
            } else {
                // Track: Assign next available color
                const color = ROUTE_COLORS[Object.keys(newData).length % ROUTE_COLORS.length];
                newData[key] = {
                    incident: loc,
                    displayId: index + 1001,
                    color: color,
                    polyline: [],
                    distance: "--",
                    duration: "--"
                };
            }
            return newData;
        });
    };

    const trackedList = Object.values(trackedData);

    return (
        <div className="min-h-screen bg-[#07090e] text-white font-sans flex flex-col md:flex-row">
            {/* INJECT KEYFRAMES FOR ICONS */}
            <style>{`
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0px rgba(inherit, 0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(0, 0, 0, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
                }
                .animated-route {
                    animation: dash 20s linear infinite;
                }
                @keyframes dash {
                    to { stroke-dashoffset: -1000; }
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }
            `}</style>

            {/* LEFT PANEL: Control Center */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-white/5 border-r border-white/10 flex flex-col h-screen overflow-hidden backdrop-blur-md z-10 relative">
                
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-b from-blue-900/40 to-transparent">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                <ShieldAlert className="w-6 h-6 text-blue-400" />
                            </div>
                            <h1 className="text-xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                Command Center
                            </h1>
                        </div>
                        <button onClick={() => navigate('/analytics')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors" title="View Analytics">
                            <BarChart2 className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
                    {trackedList.length > 0 && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mt-4 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-full border border-emerald-500/20">
                            <Activity className="w-3 h-3 animate-pulse" />
                            {trackedList.length} TARGETS TRACKED
                        </div>
                    )}
                </div>

                {/* Multi-Target HUD */}
                <AnimatePresence>
                    {trackedList.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-b border-white/10 bg-black/30 overflow-y-auto max-h-[30vh] custom-scrollbar"
                        >
                            <div className="p-4 space-y-3">
                                {trackedList.map(data => (
                                    <div key={`hud-${data.displayId}`} className="p-3 rounded-xl border border-white/10" style={{ background: `linear-gradient(to right, ${data.color}20, transparent)` }}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: data.color }}>
                                                <Crosshair className="w-4 h-4" />
                                                Target #{data.displayId}
                                            </h3>
                                            <button onClick={() => handleTrackToggle(data.incident, data.displayId - 1001)} className="text-white/50 hover:text-white text-[10px] font-bold underline">ABORT</button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-gray-500 text-[10px] uppercase font-bold mb-0.5">Dist</p>
                                                <p className="text-sm font-black text-white">{data.distance} <span className="text-[10px] font-medium text-gray-400">km</span></p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-[10px] uppercase font-bold mb-0.5">ETA</p>
                                                <p className="text-sm font-black text-white">{data.duration} <span className="text-[10px] font-medium text-gray-400">min</span></p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Incidents List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Active Signals ({locations.length})
                    </h3>

                    {locations.length === 0 ? (
                        <div className="text-center py-10 opacity-50">
                            <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                            <p className="text-sm font-medium">No active emergencies</p>
                        </div>
                    ) : (
                        locations.map((loc, index) => {
                            const key = getIncidentKey(loc);
                            const tracked = trackedData[key];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-4 rounded-2xl border transition-all ${
                                        tracked 
                                        ? 'bg-white/10 border-white/20' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                                    style={tracked ? { boxShadow: `0 0 20px ${tracked.color}30`, borderColor: `${tracked.color}80` } : {}}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h2 className="font-black text-sm text-gray-200 flex items-center gap-2">
                                                Incident #{index + 1001}
                                                {loc.aiRiskLevel === "CRITICAL" && (
                                                    <span className="bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded uppercase flex items-center gap-1 border border-red-500/30">
                                                        <AlertTriangle className="w-2.5 h-2.5" /> CRITICAL
                                                    </span>
                                                )}
                                            </h2>
                                            <p className="text-xs text-gray-500 mt-0.5 font-mono flex items-center gap-2">
                                                {parseFloat(loc.latitude).toFixed(4)}, {parseFloat(loc.longitude).toFixed(4)}
                                                {loc.aiTriggerType === "Voice" && <Mic className="w-3 h-3 text-amber-400" />}
                                                {loc.aiTriggerType === "Impact" && <Zap className="w-3 h-3 text-amber-400" />}
                                            </p>
                                        </div>
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: tracked ? tracked.color : (loc.aiRiskLevel === "CRITICAL" ? '#dc2626' : '#ef4444') }} />
                                    </div>

                                    <button
                                        onClick={() => handleTrackToggle(loc, index)}
                                        className={`w-full py-2.5 rounded-xl text-xs font-black tracking-widest transition-colors flex justify-center items-center gap-2 border ${
                                            tracked
                                            ? 'text-white'
                                            : 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/40'
                                        }`}
                                        style={tracked ? { backgroundColor: `${tracked.color}40`, borderColor: tracked.color } : {}}
                                    >
                                        <Navigation className="w-4 h-4" />
                                        {tracked ? "TRACKING ACTIVE" : "INTERCEPT"}
                                    </button>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* RIGHT PANEL: Map Dashboard */}
            <div className="w-full md:w-2/3 lg:w-3/4 h-[50vh] md:h-screen relative bg-gray-900">
                {/* Overlay UI elements on Map */}
                {!adminLocation && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/80 backdrop-blur border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                        <span className="text-xs font-bold text-gray-300">Acquiring Responder GPS Lock...</span>
                    </div>
                )}

                <MapContainer
                    center={[28.61, 77.20]}
                    zoom={12}
                    scrollWheelZoom={true}
                    className="w-full h-full z-0"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">Carto</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {/* Auto-fit Map to bounds logic */}
                    <MapBoundsUpdater routes={trackedData} adminLocation={adminLocation} />

                    {/* 🚨 Emergency Signals (Colored if tracked, Red if untracked) */}
                    {locations.map((loc, index) => {
                        const tracked = trackedData[getIncidentKey(loc)];
                        const isCritical = loc.aiRiskLevel === "CRITICAL";
                        return (
                            <Marker
                                key={`user-${index}`}
                                position={[loc.latitude, loc.longitude]}
                                icon={tracked ? createCustomIcon(tracked.color) : (isCritical ? criticalIcon : emergencyIcon)}
                            >
                                <Popup className="custom-popup">
                                    <div className="font-bold text-gray-800 flex items-center gap-1">
                                        Distress Signal #{index + 1001}
                                        {isCritical && <AlertTriangle className="w-3 h-3 text-red-600" />}
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                                        Trigger: {loc.aiTriggerType || "Manual"}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{tracked ? 'Tracking Active' : 'Awaiting Intercept'}</div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* 👮 Admin / Responder Location (Blue) */}
                    {adminLocation && (
                        <Marker position={[adminLocation.lat, adminLocation.lng]} icon={adminIcon}>
                            <Popup>
                                <div className="font-bold text-gray-800 flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-blue-600" /> Responder Base
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* 🏠 Shelters (Emerald) */}
                    {shelters.map((shelter, index) => (
                        <Marker
                            key={`shelter-${index}`}
                            position={[shelter.latitude, shelter.longitude]}
                            icon={shelterIcon}
                        >
                            <Popup>
                                <div className="font-bold text-gray-800 flex items-center gap-2">
                                    <Home className="w-4 h-4 text-emerald-600" /> {shelter.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Capacity: {shelter.capacity}</div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* 🗺️ Optimal Rescue Routes (Glowing Lines) */}
                    {Object.values(trackedData).map(data => (
                        data.polyline && data.polyline.length > 0 && (
                            <Polyline 
                                key={`route-${data.displayId}`}
                                positions={data.polyline} 
                                pathOptions={{ 
                                    color: data.color,
                                    weight: 6,
                                    opacity: 0.8,
                                    dashArray: '10, 10',
                                    lineCap: 'round',
                                    lineJoin: 'round',
                                    className: 'animated-route'
                                }} 
                            />
                        )
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}