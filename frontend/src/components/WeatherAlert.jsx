import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CloudLightning, Wind, AlertTriangle, X, 
    Sun, Cloud, CloudRain, Snowflake, MapPin, Droplets
} from "lucide-react";

// WMO Weather interpretation codes
const DANGER_CODES = [
    { codes: [65, 67], message: "Heavy Freezing Rain Detected" },
    { codes: [75, 77], message: "Heavy Snowfall/Blizzard Detected" },
    { codes: [95, 96, 99], message: "Severe Thunderstorm Detected" }
];

const getWeatherDetails = (code) => {
    if (code === 0) return { label: "Clear Sky", icon: <Sun className="w-5 h-5 text-amber-400" /> };
    if ([1, 2, 3].includes(code)) return { label: "Partly Cloudy", icon: <Cloud className="w-5 h-5 text-gray-300" /> };
    if ([45, 48].includes(code)) return { label: "Fog", icon: <Cloud className="w-5 h-5 text-gray-400" /> };
    if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", icon: <CloudRain className="w-5 h-5 text-blue-300" /> };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: "Rain", icon: <Droplets className="w-5 h-5 text-blue-400" /> };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", icon: <Snowflake className="w-5 h-5 text-white" /> };
    if ([95, 96, 99].includes(code)) return { label: "Thunderstorm", icon: <CloudLightning className="w-5 h-5 text-indigo-400" /> };
    return { label: "Unknown", icon: <Cloud className="w-5 h-5 text-gray-400" /> };
};

export default function WeatherAlert() {
    const [liveWeather, setLiveWeather] = useState(null);
    const [alert, setAlert] = useState(null);
    const [dismissed, setDismissed] = useState(false);
    const [demoMode, setDemoMode] = useState(false);

    useEffect(() => {
        const checkWeather = async (lat, lng) => {
            let actualTemp = 12;
            let actualWind = 15;
            let actualCode = 0;
            let actualLoc = "Unknown Area";
            let actualDesc = "Clear";

            try {
                // 1. Fetch Location Name
                try {
                    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
                    const geoData = await geoRes.json();
                    if (geoData && geoData.name) {
                        actualLoc = geoData.name;
                    }
                } catch (e) {
                    console.error("Geocoding failed", e);
                }

                // 2. Fetch Weather Data (wttr.in)
                const res = await fetch(`https://wttr.in/${lat},${lng}?format=j1`);
                const data = await res.json();
                
                const current = data.current_condition?.[0];
                if (current) {
                    actualTemp = parseInt(current.temp_C, 10);
                    actualWind = parseInt(current.windspeedKmph, 10);
                    actualDesc = current.weatherDesc?.[0]?.value || "Clear";
                    
                    const descLower = actualDesc.toLowerCase();
                    if (descLower.includes("cloud")) actualCode = 2;
                    if (descLower.includes("rain") || descLower.includes("shower") || descLower.includes("drizzle")) actualCode = 61;
                    if (descLower.includes("snow")) actualCode = 71;
                    if (descLower.includes("thunder") || descLower.includes("storm")) actualCode = 95;
                    if (descLower.includes("fog") || descLower.includes("haze") || descLower.includes("mist")) actualCode = 45;
                }
            } catch (err) {
                console.error("Weather API failed", err);
            }

            // Save Live Weather State
            setLiveWeather({
                location: actualLoc,
                temperature: actualTemp,
                windspeed: actualWind,
                code: actualCode,
                textDesc: actualDesc
            });

            // Demo Mode Alert Check
            if (demoMode) {
                setAlert({
                    title: `TEST WARNING IN ${actualLoc.toUpperCase()}`,
                    description: `This is a simulated alert for testing. Actual winds are ${actualWind} km/h and temperature is ${actualTemp}°C.`,
                    type: "storm"
                });
                return;
            }

            // Real Danger Alert Check
            let dangerMessage = null;
            let type = "general";

            const dangerMatch = DANGER_CODES.find(d => d.codes.includes(actualCode));
            if (dangerMatch) {
                dangerMessage = dangerMatch.message;
                type = "storm";
            }

            if (actualWind > 40) {
                if (dangerMessage) {
                    dangerMessage += ` with extreme winds (${actualWind} km/h).`;
                } else {
                    dangerMessage = `Extreme wind speeds detected (${actualWind} km/h).`;
                    type = "wind";
                }
            }

            if (dangerMessage) {
                setAlert({
                    title: `DANGEROUS WEATHER IN ${actualLoc.toUpperCase()}`,
                    description: dangerMessage + " Please stay indoors and avoid travel.",
                    type: type
                });
            } else {
                setAlert(null);
            }
        };

        const getLocationAndCheck = () => {
            if (!navigator.geolocation) {
                checkWeather(28.61, 77.20); // Default Delhi
            } else {
                navigator.geolocation.getCurrentPosition(
                    (pos) => checkWeather(pos.coords.latitude, pos.coords.longitude),
                    () => checkWeather(28.61, 77.20)
                );
            }
        };

        getLocationAndCheck();
        const interval = setInterval(() => {
            if (!demoMode && !dismissed) getLocationAndCheck();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [dismissed, demoMode]);

    if (!liveWeather) return null;

    const details = getWeatherDetails(liveWeather.code);

    return (
        <>
            {/* 📍 COMPACT REAL-TIME WIDGET (Always Visible) */}
            <div className="fixed top-0 left-0 w-full z-[9998] pointer-events-none transition-all duration-500">
                <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-3 flex justify-center md:justify-start md:pl-[240px]">
                    <AnimatePresence>
                        {(!alert || dismissed) && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className="bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full px-4 py-2 flex items-center justify-between w-[95%] md:w-auto max-w-sm text-white text-sm pointer-events-auto"
                            >
                                <div className="flex items-center gap-2 font-semibold text-gray-200 truncate">
                                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                                    <span className="truncate max-w-[100px]">{liveWeather.location}</span>
                                </div>
                                
                                <div className="flex items-center gap-3 text-gray-300 font-bold shrink-0 ml-4 md:ml-0">
                                    <span className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                                        {details.icon}
                                        {liveWeather.temperature}°C
                                    </span>
                                    <span className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                                        <Wind className="w-4 h-4 text-blue-300" />
                                        {liveWeather.windspeed} km/h
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 🚨 EXPANDED DANGER ALERT */}
            <AnimatePresence>
                {alert && !dismissed && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed top-0 left-0 w-full z-[9999] p-4 md:p-6 pointer-events-none"
                    >
                        <motion.div 
                            animate={{
                                boxShadow: [
                                    "0 10px 40px rgba(220,38,38,0.5)",
                                    "0 10px 60px rgba(220,38,38,0.8)",
                                    "0 10px 40px rgba(220,38,38,0.5)"
                                ]
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="max-w-4xl mx-auto bg-gradient-to-r from-red-900 to-red-600 border-2 border-red-400 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between pointer-events-auto backdrop-blur-xl relative overflow-hidden"
                        >
                            {/* Danger UI Content */}
                            <div className="flex items-start md:items-center gap-4 w-full relative z-10">
                                <div className="bg-white/20 p-3 rounded-full animate-pulse shrink-0">
                                    {alert.type === "wind" ? <Wind className="w-8 h-8 text-white" /> :
                                     alert.type === "storm" ? <CloudLightning className="w-8 h-8 text-white" /> :
                                     <AlertTriangle className="w-8 h-8 text-white" />}
                                </div>
                                <div className="flex-1 pr-8 md:pr-0">
                                    <h3 className="text-white font-black text-lg md:text-xl tracking-wide uppercase leading-tight mb-1">
                                        {alert.title}
                                    </h3>
                                    <p className="text-red-100 font-medium text-sm md:text-base leading-snug">
                                        {alert.description}
                                    </p>
                                    
                                    {/* Live Stats embedded in Danger Alert */}
                                    <div className="mt-3 flex gap-3 text-xs font-bold text-white/80 uppercase">
                                        <span className="bg-black/30 px-2 py-1 rounded">Temp: {liveWeather.temperature}°C</span>
                                        <span className="bg-black/30 px-2 py-1 rounded">Wind: {liveWeather.windspeed} km/h</span>
                                        <span className="bg-black/30 px-2 py-1 rounded text-amber-200">{liveWeather.textDesc || details.label}</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setDismissed(true)}
                                className="absolute top-4 right-4 md:relative md:top-0 md:right-0 bg-black/20 hover:bg-black/40 p-2 rounded-xl transition-colors text-white md:ml-4 shrink-0 z-20"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DEMO TOGGLE BUTTON - Fixed bottom left corner for testing */}
            <div className="fixed bottom-24 left-4 z-[9999] pointer-events-auto">
                <button
                    onClick={() => {
                        setDismissed(false);
                        if(demoMode) {
                            setDemoMode(false);
                            setAlert(null); 
                        } else {
                            setDemoMode(true);
                        }
                    }}
                    className={`text-[10px] sm:text-xs px-3 py-1.5 rounded-full font-bold shadow-lg transition-colors border ${
                        demoMode 
                        ? 'bg-red-600 text-white border-red-500 hover:bg-red-700' 
                        : 'bg-white/10 text-gray-400 border-white/10 hover:bg-white/20 backdrop-blur-sm'
                    }`}
                >
                    {demoMode ? "Disable Alert Demo" : "Test Danger Alert"}
                </button>
            </div>
        </>
    );
}
