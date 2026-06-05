import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Home as HomeIcon, Map as MapIcon, List, PhoneCall, 
    Navigation as NavIcon, Loader2, AlertTriangle, Globe, BookOpen, 
    HeartPulse, X, Info, Phone, Building2, Users
} from "lucide-react";
import ShelterMap from "../components/ShelterMap";
import { calculateDistance } from "../utils/distance";

// Static NDMA/SDRF Helplines Data
const HELPLINES_DATA = [
    { id: 1, name: "NDMA Control Room", phone: "1078", desc: "National Disaster Management Authority - All India", icon: <Shield className="w-6 h-6 text-emerald-400" /> },
    { id: 2, name: "SDRF Emergency", phone: "1070", desc: "State Disaster Response Force - Regional Control", icon: <AlertTriangle className="w-6 h-6 text-amber-400" /> },
    { id: 3, name: "Medical Emergency", phone: "108", desc: "National Ambulance Service", icon: <HeartPulse className="w-6 h-6 text-rose-400" /> },
    { id: 4, name: "Women's Helpline", phone: "1091", desc: "Domestic & Public Safety for Women", icon: <Phone className="w-6 h-6 text-pink-400" /> },
    { id: 5, name: "Childline", phone: "1098", desc: "Assistance for Children in Distress", icon: <Phone className="w-6 h-6 text-blue-400" /> },
    { id: 6, name: "Fire & Rescue", phone: "101", desc: "National Fire Service", icon: <AlertTriangle className="w-6 h-6 text-orange-400" /> },
];

export default function Shelters() {
    const [category, setCategory] = useState("shelters"); // "shelters" | "police" | "helplines"
    const [view, setView] = useState("list"); // "list" | "map"
    
    const [shelters, setShelters] = useState([]);
    const [policeStations, setPoliceStations] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [activeDestination, setActiveDestination] = useState(null);
    const [showGuidelines, setShowGuidelines] = useState(false);
    const [language, setLanguage] = useState("en");

    const t = (text) => {
        if (language === "en") return text;
        const dict = {
            "Disaster": "आपदा",
            "Resources": "संसाधन",
            "Access verified shelters, local authorities, and national helplines based on your live location.": "अपने लाइव स्थान के आधार पर सत्यापित आश्रयों, स्थानीय अधिकारियों और हेल्पलाइनों तक पहुंचें।",
            "Shelters": "आश्रय",
            "Hospitals": "अस्पताल",
            "Police": "पुलिस",
            "NGOs": "एनजीओ",
            "Helplines": "हेल्पलाइन",
            "Safety Guidelines (Do's & Don'ts)": "सुरक्षा दिशानिर्देश",
            "List": "सूची",
            "Map": "नक्शा"
        };
        return dict[text] || text;
    };
    
    const [userLocation, setUserLocation] = useState({
        lat: 28.61,
        lng: 77.20,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLoading(false);
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setUserLocation({ lat, lng });

                // Fetch Shelters (from backend)
                fetch(`/api/shelters/nearest?tenantId=1&latitude=${lat}&longitude=${lng}`)
                    .then(async (res) => {
                        const text = await res.text();
                        try {
                            const data = JSON.parse(text);
                            if(Array.isArray(data)) {
                                data.sort((a, b) => calculateDistance(lat, lng, a.latitude, a.longitude) - calculateDistance(lat, lng, b.latitude, b.longitude));
                                setShelters(data);
                                localStorage.setItem('cached_shelters', JSON.stringify(data));
                            } else {
                                setFetchError("API returned valid JSON but not an array: " + text.substring(0, 100));
                            }
                        } catch (e) {
                            setFetchError("JSON Parse Error. Raw text: " + text.substring(0, 100));
                        }
                    })
                    .catch(e => {
                        if (!navigator.onLine) {
                            const cached = localStorage.getItem('cached_shelters');
                            if (cached) {
                                setShelters(JSON.parse(cached));
                                setFetchError("Offline Mode: Showing previously cached shelters.");
                            } else {
                                setFetchError("Offline Mode: No cached shelters available.");
                            }
                        } else {
                            setFetchError("Network Fetch Error: " + e.message);
                        }
                    });

                // Fetch Live Infrastructure using Photon Komoot API (Highly reliable, no CORS/refusal issues)
                const fetchPhoton = (query, defaultName, defaultPhone) => 
                    fetch(`https://photon.komoot.io/api/?q=${query}&lat=${lat}&lon=${lng}&limit=15`)
                        .then(res => res.json())
                        .then(data => {
                            if(!data || !data.features) return [];
                            return data.features
                                .filter(f => f.properties.name) // only keep named places
                                .map(f => ({
                                    id: f.properties.osm_id || Math.random(),
                                    name: f.properties.name,
                                    latitude: f.geometry.coordinates[1],
                                    longitude: f.geometry.coordinates[0],
                                    capacity: "N/A",
                                    phone: defaultPhone
                                }));
                        });

                Promise.all([
                    fetchPhoton("police station", "Police Station", "100"),
                    fetchPhoton("government hospital", "Government Hospital", "102"),
                    fetchPhoton("foundation", "NGO / Social Facility", "1070")
                ])
                .then(([p, h, n]) => {
                    const sortFn = (a, b) => calculateDistance(lat, lng, a.latitude, a.longitude) - calculateDistance(lat, lng, b.latitude, b.longitude);
                    
                    // Filter out garbage results that are > 25km away (Photon returns global fallbacks if nothing local is found)
                    const filterDist = (item) => calculateDistance(lat, lng, item.latitude, item.longitude) <= 25;
                    
                    const filteredP = p.filter(filterDist).sort(sortFn).slice(0, 3);
                    const filteredH = h.filter(filterDist).sort(sortFn).slice(0, 3);
                    const filteredN = n.filter(filterDist).sort(sortFn).slice(0, 3);
                    
                    setPoliceStations(filteredP); setHospitals(filteredH); setNgos(filteredN);
                    
                    // Cache for offline
                    localStorage.setItem('cached_police', JSON.stringify(filteredP));
                    localStorage.setItem('cached_hospitals', JSON.stringify(filteredH));
                    localStorage.setItem('cached_ngos', JSON.stringify(filteredN));
                })
                .catch(e => {
                    if (!navigator.onLine) {
                        const cp = localStorage.getItem('cached_police');
                        const ch = localStorage.getItem('cached_hospitals');
                        const cn = localStorage.getItem('cached_ngos');
                        if (cp) setPoliceStations(JSON.parse(cp));
                        if (ch) setHospitals(JSON.parse(ch));
                        if (cn) setNgos(JSON.parse(cn));
                    }
                    console.error("Photon Fetch Error", e);
                })
                .finally(() => setLoading(false));
            },
            (err) => {
                console.error("Location error:", err);
                setUserLocation({ lat: 28.61, lng: 77.2 });
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const activeData = category === "shelters" ? shelters : category === "police" ? policeStations : category === "hospitals" ? hospitals : category === "ngos" ? ngos : [];

    return (
        <div className="min-h-screen bg-[#07090e] text-white font-sans relative overflow-x-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="p-6 md:p-10 max-w-7xl mx-auto relative z-10 pb-32">
                
                {/* SACHET Geo-Targeted Alert Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-gradient-to-r from-red-900/80 to-orange-900/80 border border-red-500/50 rounded-2xl p-4 mb-8 flex items-start md:items-center gap-4 shadow-[0_0_30px_rgba(220,38,38,0.2)] backdrop-blur-md relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none" />
                    <div className="bg-red-500/20 p-2.5 rounded-xl border border-red-500/30 animate-pulse shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <h3 className="font-black text-red-100 tracking-wide uppercase text-sm md:text-base mb-1 flex items-center gap-2">
                            SACHET ALERT <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE</span>
                        </h3>
                        <p className="text-red-200/90 text-xs md:text-sm font-medium">
                            Heavy rainfall and localized flooding expected in your district over the next 24 hours. Move to higher ground or nearest safe shelter immediately. Do not travel unless absolutely necessary.
                        </p>
                    </div>
                </motion.div>

                {/* Header Actions: Language & Guidelines */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center justify-between gap-4 mb-8"
                >
                    <button 
                        onClick={() => setLanguage(l => l === "en" ? "hi" : "en")}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold text-gray-300 transition-colors">
                        <Globe className="w-4 h-4 text-indigo-400" />
                        {language === "en" ? "English / हिंदी" : "हिंदी / English"}
                    </button>

                    <button 
                        onClick={() => setShowGuidelines(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-colors"
                    >
                        <BookOpen className="w-4 h-4" />
                        {t("Safety Guidelines (Do's & Don'ts)")}
                    </button>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                >
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            {t("Disaster")} <span className="text-indigo-400">{t("Resources")}</span>
                        </h1>
                        <p className="text-gray-400 text-base md:text-lg max-w-xl">
                            {t("Access verified shelters, local authorities, and national helplines based on your live location.")}
                        </p>
                    </div>

                    {/* Main Category Toggle */}
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] w-full md:w-auto shrink-0 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => { setCategory("shelters"); setView("list"); }}
                            className={`flex-1 min-w-[90px] px-3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${category === "shelters" ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                        >
                            <HomeIcon className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">{t("Shelters")}</span>
                        </button>
                        <button
                            onClick={() => { setCategory("hospitals"); setView("list"); }}
                            className={`flex-1 min-w-[90px] px-3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${category === "hospitals" ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                        >
                            <HeartPulse className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">{t("Hospitals")}</span>
                        </button>
                        <button
                            onClick={() => { setCategory("police"); setView("list"); }}
                            className={`flex-1 min-w-[90px] px-3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${category === "police" ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                        >
                            <Shield className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">{t("Police")}</span>
                        </button>
                        <button
                            onClick={() => { setCategory("ngos"); setView("list"); }}
                            className={`flex-1 min-w-[90px] px-3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${category === "ngos" ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                        >
                            <Users className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">{t("NGOs")}</span>
                        </button>
                        <button
                            onClick={() => { setCategory("helplines"); setView("list"); }}
                            className={`flex-1 min-w-[90px] px-3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${category === "helplines" ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                        >
                            <PhoneCall className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">{t("Helplines")}</span>
                        </button>
                    </div>
                </motion.div>

                {/* View Mode Toggle (List/Map) - Hidden for Helplines */}
                {category !== "helplines" && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-end mb-6"
                    >
                        <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 backdrop-blur-md">
                            <button
                                onClick={() => setView("list")}
                                className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${view === "list" ? "bg-white/20 text-white shadow-sm" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                            >
                                <List className="w-4 h-4" /> {t("List")}
                            </button>
                            <button
                                onClick={() => {
                                    if (!activeDestination && activeData.length > 0) {
                                        setActiveDestination({ lat: activeData[0].latitude, lng: activeData[0].longitude, name: activeData[0].name });
                                    }
                                    setView("map");
                                }}
                                className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${view === "map" ? "bg-white/20 text-white shadow-sm" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                            >
                                <MapIcon className="w-4 h-4" /> {t("Map")}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* CONTENT */}
                {category === "helplines" ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {HELPLINES_DATA.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 md:p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-xl transition-all duration-300 flex flex-col h-full backdrop-blur-md"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="bg-black/40 p-3 rounded-2xl border border-white/5 shadow-inner">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h2 className="font-extrabold text-xl text-white">{item.name}</h2>
                                        <p className="text-gray-400 text-sm mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="mt-auto pt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => window.location.href = `tel:${item.phone}`}
                                        className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                                    >
                                        <PhoneCall className="w-5 h-5" /> Dial {item.phone}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : loading ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-sm"
                    >
                        <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-500" />
                        <p className="font-semibold tracking-wide text-lg">Locating nearest {category}...</p>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        {view === "list" ? (
                            <motion.div 
                                key={`list-${category}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {fetchError && (
                                    <div className="col-span-full py-4 px-6 text-center bg-red-500/20 border-2 border-red-500 border-dashed rounded-[2rem]">
                                        <p className="text-red-400 font-bold">Debug Error: {fetchError}</p>
                                    </div>
                                )}
                                {activeData.length === 0 ? (
                                    <div className="w-full h-64 flex flex-col items-center justify-center border border-white/10 bg-white/5 rounded-[2rem] backdrop-blur-sm">
                                        <MapIcon className="w-12 h-12 mb-4 text-gray-500 opacity-50" />
                                        <p className="text-gray-400 text-lg font-medium">No {category} found nearby.</p>
                                    </div>
                                ) : (
                                    activeData.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`p-6 md:p-8 rounded-[2rem] flex flex-col justify-between transition-all duration-300 border backdrop-blur-md ${
                                                index === 0 && category === "shelters" ? "bg-gradient-to-br from-indigo-900/40 to-black border-indigo-500/40 shadow-[0_10px_40px_rgba(99,102,241,0.15)] transform md:scale-[1.03] md:-translate-y-2 z-10" :
                                                index === 0 && category === "police" ? "bg-gradient-to-br from-blue-900/40 to-black border-blue-500/40 shadow-[0_10px_40px_rgba(59,130,246,0.15)] transform md:scale-[1.03] md:-translate-y-2 z-10" :
                                                index === 0 && category === "hospitals" ? "bg-gradient-to-br from-rose-900/40 to-black border-rose-500/40 shadow-[0_10px_40px_rgba(225,29,72,0.15)] transform md:scale-[1.03] md:-translate-y-2 z-10" :
                                                index === 0 && category === "ngos" ? "bg-gradient-to-br from-amber-900/40 to-black border-amber-500/40 shadow-[0_10px_40px_rgba(245,158,11,0.15)] transform md:scale-[1.03] md:-translate-y-2 z-10" :
                                                "bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-xl"
                                            }`}
                                        >
                                            <div className="mb-8">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h2 className="font-extrabold text-2xl leading-tight pr-4 text-white">{item.name}</h2>
                                                    {category === "police" ? (
                                                        <div className="bg-blue-500/20 p-2.5 rounded-xl shrink-0">
                                                            <Shield className="w-6 h-6 text-blue-400" />
                                                        </div>
                                                    ) : category === "hospitals" ? (
                                                        <div className="bg-rose-500/20 p-2.5 rounded-xl shrink-0">
                                                            <HeartPulse className="w-6 h-6 text-rose-400" />
                                                        </div>
                                                    ) : category === "ngos" ? (
                                                        <div className="bg-amber-500/20 p-2.5 rounded-xl shrink-0">
                                                            <Users className="w-6 h-6 text-amber-400" />
                                                        </div>
                                                    ) : (
                                                        <div className="bg-indigo-500/20 p-2.5 rounded-xl shrink-0">
                                                            <HomeIcon className="w-6 h-6 text-indigo-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    {category === "shelters" && (
                                                        <p className="text-sm text-gray-400 font-medium">Capacity: <span className="text-gray-200">{item.capacity}</span></p>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <NavIcon className={`w-4 h-4 ${category === "police" ? "text-blue-500" : category === "hospitals" ? "text-rose-500" : category === "ngos" ? "text-amber-500" : "text-indigo-500"}`} />
                                                        <p className={`text-base font-bold ${category === "police" ? "text-blue-400" : category === "hospitals" ? "text-rose-400" : category === "ngos" ? "text-amber-400" : "text-indigo-400"}`}>
                                                            {calculateDistance(userLocation.lat, userLocation.lng, item.latitude, item.longitude).toFixed(2)} km away
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 mt-auto">
                                                <button 
                                                    onClick={() => window.location.href = `tel:${item.phone || "100"}`}
                                                    className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                                        category === "police" ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20" : 
                                                        category === "hospitals" ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20" :
                                                        category === "ngos" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20" :
                                                        "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20"
                                                    }`}
                                                >
                                                    <PhoneCall className="w-4 h-4" /> Call
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveDestination({ lat: item.latitude, lng: item.longitude, name: item.name });
                                                        setView("map");
                                                    }}
                                                    className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                                                        category === "police" ? "bg-blue-600 hover:bg-blue-500 text-white" : 
                                                        category === "hospitals" ? "bg-rose-600 hover:bg-rose-500 text-white" :
                                                        category === "ngos" ? "bg-amber-600 hover:bg-amber-500 text-white" :
                                                        "bg-indigo-600 hover:bg-indigo-500 text-white"
                                                    }`}
                                                >
                                                    <NavIcon className="w-4 h-4" /> Route
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="map-view"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-[600px] bg-white/5 relative z-20"
                            >
                                {activeData.length > 0 && userLocation ? (
                                    <ShelterMap 
                                        shelters={activeData} 
                                        userLocation={userLocation} 
                                        activeDestination={activeDestination} 
                                        onClearRoute={() => setActiveDestination(null)}
                                        category={category}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                        <MapIcon className="w-12 h-12 mb-4 opacity-50" />
                                        <p>No {category} found nearby.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

            </div>

            {/* SAFETY GUIDELINES MODAL (SACHET Do's & Don'ts) */}
            <AnimatePresence>
                {showGuidelines && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setShowGuidelines(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar bg-gray-900 border border-white/10 rounded-3xl shadow-2xl"
                        >
                            <div className="sticky top-0 bg-gray-900/90 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center z-10">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-indigo-400" />
                                    Safety Guidelines
                                </h2>
                                <button 
                                    onClick={() => setShowGuidelines(false)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Floods */}
                                <div>
                                    <h3 className="text-xl font-black text-blue-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                                        <Info className="w-5 h-5" /> Floods & Heavy Rain
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                                            <h4 className="text-emerald-400 font-bold mb-2">DO'S</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1.5 marker:text-emerald-500">
                                                <li>Turn off power and gas connections.</li>
                                                <li>Move to higher ground immediately.</li>
                                                <li>Drink only boiled or purified water.</li>
                                                <li>Keep your emergency kit ready.</li>
                                            </ul>
                                        </div>
                                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                                            <h4 className="text-red-400 font-bold mb-2">DON'TS</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1.5 marker:text-red-500">
                                                <li>Do not walk through flowing water.</li>
                                                <li>Do not drive into flooded areas.</li>
                                                <li>Do not touch electrical equipment if wet.</li>
                                                <li>Do not eat food exposed to flood water.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Earthquakes */}
                                <div>
                                    <h3 className="text-xl font-black text-amber-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                                        <Info className="w-5 h-5" /> Earthquakes
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                                            <h4 className="text-emerald-400 font-bold mb-2">DO'S</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1.5 marker:text-emerald-500">
                                                <li>Drop, Cover, and Hold On.</li>
                                                <li>Stay away from glass and windows.</li>
                                                <li>If outside, move to an open clear area.</li>
                                                <li>Use stairs instead of elevators.</li>
                                            </ul>
                                        </div>
                                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                                            <h4 className="text-red-400 font-bold mb-2">DON'TS</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1.5 marker:text-red-500">
                                                <li>Do not run outside during shaking.</li>
                                                <li>Do not stand under doorways.</li>
                                                <li>Do not light matches or use open flames.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}