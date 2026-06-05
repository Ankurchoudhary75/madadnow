import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Phone, Flame, HeartPulse, MoreHorizontal, 
    Power, ArrowLeft, Volume2, ShieldCheck, MapPin, 
    Wifi, CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Emergency112() {
    const navigate = useNavigate();
    const [isTriggered, setIsTriggered] = useState(false);
    const [shoutEnabled, setShoutEnabled] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [status, setStatus] = useState("idle"); // idle, counting, connecting, active
    const [sosCooldown, setSosCooldown] = useState(0);

    const [locationStatus, setLocationStatus] = useState("Locating...");

    useEffect(() => {
        // Mock GPS lock
        setTimeout(() => setLocationStatus("GPS Locked (Accuracy: 5m)"), 2000);
    }, []);

    useEffect(() => {
        let timer;
        if (status === "counting" && countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        } else if (status === "counting" && countdown === 0) {
            setStatus("connecting");
            setTimeout(() => {
                setStatus("active");
                send112SOS("General");
            }, 3000); // Mock connection time
        }
        return () => clearTimeout(timer);
    }, [status, countdown]);

    const send112SOS = (type) => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const payload = {
                    tenantId: 1,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    aiTriggerType: "112_" + type,
                    aiRiskLevel: "CRITICAL",
                    timestamp: new Date().toISOString()
                };

                if (!navigator.onLine) {
                    const queue = JSON.parse(localStorage.getItem('offline_sos_queue') || '[]');
                    queue.push(payload);
                    localStorage.setItem('offline_sos_queue', JSON.stringify(queue));
                    return;
                }

                try {
                    await fetch("/api/emergency/update-location", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                } catch (err) {
                    console.error("Failed to send 112 SOS", err);
                }
            },
            (err) => console.error("Location error", err),
            { enableHighAccuracy: true }
        );
    };

    // Countdown Timer for SOS Rate Limiter
    useEffect(() => {
        if (sosCooldown > 0) {
            const timer = setTimeout(() => setSosCooldown(sosCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [sosCooldown]);

    const handleSOS = () => {
        if (sosCooldown > 0) return;
        if (status === "idle") {
            setIsTriggered(true);
            setStatus("counting");
            setSosCooldown(20);
        }
    };

    const handleCancel = () => {
        setIsTriggered(false);
        setStatus("idle");
        setCountdown(5);
    };

    const handleSpecificEmergency = (type) => {
        if (sosCooldown > 0) return;
        setIsTriggered(true);
        setStatus("connecting");
        setSosCooldown(20);
        setTimeout(() => {
            setStatus("active");
            send112SOS(type);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black z-[9999] overflow-hidden flex flex-col font-sans">
            
            {/* Ambient Background */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isTriggered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 blur-[150px] rounded-full animate-pulse pointer-events-none" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 relative z-10 bg-black/50 backdrop-blur-md border-b border-white/10">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <h1 className="text-3xl font-black tracking-widest text-white">112</h1>
                    <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">ERSS India</p>
                </div>
                <div className="w-12" /> {/* Spacer */}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                
                {/* GPS Status */}
                <div className="absolute top-6 flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-gray-300">
                    <MapPin className={`w-4 h-4 ${locationStatus.includes("Locked") ? "text-emerald-400" : "text-amber-400 animate-pulse"}`} />
                    {locationStatus}
                </div>

                <AnimatePresence mode="wait">
                    {status === "idle" ? (
                        <motion.div 
                            key="idle"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center w-full"
                        >
                            {/* SHOUT Feature Toggle */}
                            <div className="mb-12 flex flex-col items-center">
                                <button 
                                    onClick={() => setShoutEnabled(!shoutEnabled)}
                                    className={`relative flex items-center justify-between w-48 p-2 rounded-full border-2 transition-all duration-300 overflow-hidden ${
                                        shoutEnabled 
                                        ? "border-amber-400 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.3)]" 
                                        : "border-white/20 bg-white/5"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 pl-2 relative z-10">
                                        <Volume2 className={`w-5 h-5 ${shoutEnabled ? "text-amber-400" : "text-gray-400"}`} />
                                        <span className={`font-black tracking-widest ${shoutEnabled ? "text-amber-400" : "text-gray-400"}`}>SHOUT</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 relative z-10 ${
                                        shoutEnabled ? "translate-x-0 bg-amber-400" : "-translate-x-24 bg-gray-600"
                                    }`}>
                                        <ShieldCheck className={`w-4 h-4 ${shoutEnabled ? "text-black" : "text-white"}`} />
                                    </div>
                                </button>
                                <p className="text-xs text-gray-500 mt-3 font-medium uppercase tracking-wider text-center max-w-[200px]">
                                    {shoutEnabled ? "Nearby volunteers will be alerted" : "Tap to alert nearby volunteers"}
                                </p>
                            </div>

                            {/* Massive SOS Button */}
                            <button 
                                onClick={handleSOS}
                                disabled={sosCooldown > 0}
                                className={`relative group focus:outline-none ${sosCooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="absolute inset-0 bg-red-600/30 rounded-full blur-2xl group-hover:bg-red-600/50 transition-colors" />
                                <div className={`absolute inset-[-20px] border-4 border-red-500/20 rounded-full ${sosCooldown === 0 && 'animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]'}`} />
                                <div className={`absolute inset-[-40px] border-4 border-red-500/10 rounded-full ${sosCooldown === 0 && 'animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]'}`} />
                                
                                <div className={`w-56 h-56 md:w-64 md:h-64 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.5),inset_0_10px_20px_rgba(255,255,255,0.3)] flex flex-col items-center justify-center border-4 transform transition-all duration-300 ${sosCooldown > 0 ? 'bg-red-900 border-red-900' : 'bg-gradient-to-br from-red-500 to-red-700 border-red-400 group-hover:scale-95 active:scale-90'}`}>
                                    <Power className={`w-20 h-20 mb-2 ${sosCooldown > 0 ? 'text-red-400' : 'text-white'}`} strokeWidth={2.5} />
                                    <span className="text-white font-black text-4xl tracking-widest drop-shadow-md">
                                        {sosCooldown > 0 ? `${sosCooldown}s` : 'SOS'}
                                    </span>
                                </div>
                            </button>
                            <p className="text-sm text-gray-400 font-bold mt-10 uppercase tracking-widest">
                                Press to trigger emergency
                            </p>
                        </motion.div>

                    ) : status === "counting" ? (
                        <motion.div 
                            key="counting"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-48 h-48 rounded-full border-8 border-red-500/30 border-t-red-500 animate-spin flex items-center justify-center relative">
                                <div className="animate-spin-reverse absolute inset-0 flex items-center justify-center">
                                    <span className="text-7xl font-black text-white">{countdown}</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-red-400 mt-8 text-center uppercase tracking-widest">
                                Initiating SOS
                            </h2>
                            <p className="text-gray-400 text-center mt-2 font-medium">
                                Sending Location & Details to PSAP
                            </p>
                            
                            <button 
                                onClick={handleCancel}
                                className="mt-12 px-10 py-4 bg-white/10 hover:bg-white/20 rounded-full text-white font-bold tracking-widest uppercase border border-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                        </motion.div>

                    ) : (
                        <motion.div 
                            key="active"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center w-full max-w-md bg-black/60 backdrop-blur-xl border border-red-500/30 p-8 rounded-[3rem] shadow-2xl"
                        >
                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-50" />
                                {status === "connecting" ? (
                                    <Wifi className="w-10 h-10 text-red-500 animate-pulse" />
                                ) : (
                                    <CheckCircle2 className="w-12 h-12 text-red-500" />
                                )}
                            </div>
                            
                            <h2 className="text-3xl font-black text-white text-center tracking-wide mb-2 uppercase">
                                {status === "connecting" ? "Connecting..." : "SOS Active"}
                            </h2>
                            <p className="text-gray-400 text-center text-sm font-medium leading-relaxed">
                                {status === "connecting" 
                                    ? "Transmitting data to State Emergency Control Room." 
                                    : "Control Room notified. Help is being dispatched to your location."}
                            </p>

                            {status === "active" && shoutEnabled && (
                                <div className="mt-6 w-full bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
                                    <Volume2 className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-1">Shout Active</h4>
                                        <p className="text-gray-300 text-xs">2 verified volunteers nearby have been alerted and are responding.</p>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={handleCancel}
                                className="w-full mt-8 py-4 bg-red-600 hover:bg-red-700 rounded-2xl text-white font-black tracking-widest uppercase shadow-lg shadow-red-600/20 transition-colors"
                            >
                                Stop SOS
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Specific Action Grid */}
            <div className={`p-6 bg-black/80 backdrop-blur-lg border-t border-white/10 transition-transform duration-500 ${status === "idle" ? 'translate-y-0' : 'translate-y-full absolute bottom-0 w-full'}`}>
                <div className="max-w-md mx-auto grid grid-cols-4 gap-4">
                    <button onClick={() => handleSpecificEmergency("police")} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-500/10 group-hover:bg-blue-500 border border-blue-500/30 rounded-full flex items-center justify-center transition-colors">
                            <ShieldCheck className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-wider">Police</span>
                    </button>
                    <button onClick={() => handleSpecificEmergency("fire")} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-500/10 group-hover:bg-orange-500 border border-orange-500/30 rounded-full flex items-center justify-center transition-colors">
                            <Flame className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-wider">Fire</span>
                    </button>
                    <button onClick={() => handleSpecificEmergency("medical")} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 group-hover:bg-emerald-500 border border-emerald-500/30 rounded-full flex items-center justify-center transition-colors">
                            <HeartPulse className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-wider">Medical</span>
                    </button>
                    <button onClick={() => handleSpecificEmergency("other")} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-500/10 group-hover:bg-gray-500 border border-gray-500/30 rounded-full flex items-center justify-center transition-colors">
                            <MoreHorizontal className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-wider">Other</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
