import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Siren, PhoneCall, ShieldAlert, HeartPulse, MapPin, Navigation, Info, BellRing, BrainCircuit, Mic, Activity } from "lucide-react";
import AIHelper from "../components/AIHelper";

const emergencyContact = "918708802939";

export default function Emergency() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [shelters, setShelters] = useState([]);
    const [aiMode, setAiMode] = useState(false);
    const [sosCooldown, setSosCooldown] = useState(0);

    // Countdown Timer for SOS Rate Limiter
    useEffect(() => {
        if (sosCooldown > 0) {
            const timer = setTimeout(() => setSosCooldown(sosCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [sosCooldown]);

    // 🔥 BACKEND CALL SOS HANDLER
    const handleSOS = useCallback((triggerType = "Manual") => {
        if (sosCooldown > 0) {
            setMessage(`⏳ Please wait ${sosCooldown}s before triggering another SOS.`);
            return;
        }
        setSosCooldown(20); // 20 Second Rate Limiter
        
        setLoading(true);
        setMessage(`Triggered by: ${triggerType}. Fetching your location...`);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const riskLevel = triggerType === "Manual" ? "ELEVATED" : "CRITICAL";

                    console.log("USER LOCATION:", lat, lng, "TYPE:", triggerType);

                    // Fetch Shelters
                    const res = await fetch(`/api/shelters/nearest?tenantId=1&latitude=${lat}&longitude=${lng}`);
                    const data = await res.json();
                    
                    if (Array.isArray(data)) {
                        setShelters(data);
                    }

                    // ✅ START REAL-TIME TRACKING WITH AI METADATA
                    const sendLocation = async (liveLat, liveLng) => {
                        const payload = {
                            tenantId: 1,
                            latitude: liveLat,
                            longitude: liveLng,
                            aiTriggerType: triggerType,
                            aiRiskLevel: riskLevel,
                            timestamp: new Date().toISOString()
                        };

                        if (!navigator.onLine) {
                            const queue = JSON.parse(localStorage.getItem('offline_sos_queue') || '[]');
                            queue.push(payload);
                            localStorage.setItem('offline_sos_queue', JSON.stringify(queue));
                            setMessage("📶 OFFLINE MODE: SOS Queued. Will send automatically when connectivity is restored.");
                            return;
                        }

                        try {
                            await fetch("/api/emergency/update-location", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(payload),
                            });
                        } catch (err) {
                            console.error(err);
                        }
                    };

                    // Send initial location
                    sendLocation(lat, lng);

                    // Start Interval
                    setInterval(() => {
                        navigator.geolocation.getCurrentPosition(pos => sendLocation(pos.coords.latitude, pos.coords.longitude));
                    }, 5000);

                    // Alert Contacts
                    const emergencyMessage = `🚨 EMERGENCY ALERT!\nTriggered by: ${triggerType}\n\nI need help. My Live Location:\nhttps://maps.google.com/?q=${lat},${lng}`;
                    const savedContacts = JSON.parse(localStorage.getItem("madadnow_contacts")) || [];
                    const contactsToAlert = savedContacts.length > 0 ? savedContacts : [{ phone: emergencyContact }];

                    contactsToAlert.forEach((contact) => {
                        const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
                        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(emergencyMessage)}`, "_blank");
                    });

                    setMessage(`🚨 ${triggerType} Alert Active. Contacts alerted.`);
                    
                } catch (err) {
                    console.error(err);
                    setMessage("❌ Failed to process SOS.");
                }
                setLoading(false);
            },
            (error) => {
                console.error(error);
                setMessage("❌ Location permission denied.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [sosCooldown]);

    // 🧠 AI RISK ENGINE HOOK
    useEffect(() => {
        let recognition = null;

        if (aiMode) {
            setMessage("🤖 AI Sentinel Mode Active. Monitoring Voice & Motion...");
            
            // 1. Audio Distress AI
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onresult = (event) => {
                    const transcript = Array.from(event.results).map(res => res[0].transcript).join('').toLowerCase();
                    if (transcript.includes("help") || transcript.includes("police") || transcript.includes("attack") || transcript.includes("accident")) {
                        console.log("🗣️ AI VOICE DISTRESS DETECTED");
                        setAiMode(false); // Disable to prevent spam
                        handleSOS("Voice");
                    }
                };
                
                recognition.onerror = (err) => console.log("Speech Recog Error", err);
                recognition.start();
            }

            // 2. Kinetic Shock AI
            const handleMotion = (e) => {
                const acc = e.accelerationIncludingGravity;
                if (!acc || acc.x === null) return;
                
                // Calculate G-Force magnitude
                const gForce = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z) / 9.8;
                
                // If phone detects massive drop/impact (e.g. > 3 Gs)
                if (gForce > 3.0) {
                    console.log("💥 AI KINETIC SHOCK DETECTED", gForce);
                    setAiMode(false);
                    handleSOS("Impact");
                }
            };
            
            window.addEventListener('devicemotion', handleMotion, true);

            return () => {
                if (recognition) recognition.stop();
                window.removeEventListener('devicemotion', handleMotion, true);
            };
        } else {
            if (message.includes("Sentinel")) setMessage("");
        }
    }, [aiMode, handleSOS, message]);

    return (
        <div className="min-h-screen bg-[#07090e] text-white relative overflow-hidden font-sans pb-10">
            {/* Dark Red Ambient Glow */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 py-6 md:py-10 relative z-10 md:grid md:grid-cols-12 md:gap-10 md:items-start">

                {/* LEFT COLUMN: Header & SOS */}
                <div className="md:col-span-5 md:sticky md:top-32 flex flex-col items-center md:items-start text-center md:text-left mb-10 md:mb-0">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center md:items-start mb-8">
                        <div className="w-14 h-14 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                            <Siren className="w-7 h-7 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1.5">Emergency Center</h1>
                        <p className="text-gray-400 text-xs max-w-[260px] md:max-w-xs">Help is available 24/7. Tap below or enable AI Sentinel.</p>
                    </motion.div>

                    {/* 🚨 SOS BUTTON */}
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full relative">
                        <motion.button
                            whileHover={{ scale: sosCooldown > 0 ? 1 : 1.02 }} whileTap={{ scale: sosCooldown > 0 ? 1 : 0.97 }}
                            onClick={() => handleSOS("Manual")}
                            disabled={loading || sosCooldown > 0}
                            className={`w-full py-6 rounded-[2rem] flex flex-col items-center justify-center gap-2 shadow-[0_10px_40px_rgba(220,38,38,0.3)] transition-all border ${loading || sosCooldown > 0 ? 'bg-red-900/50 border-red-900/50 cursor-not-allowed text-red-300' : 'bg-gradient-to-b from-red-600 to-red-800 border-red-500 hover:from-red-500 hover:to-red-700'}`}
                        >
                            <BellRing className={`w-10 h-10 ${loading || sosCooldown > 0 ? 'text-red-400 opacity-50' : 'text-white animate-pulse'}`} />
                            <span className="text-2xl font-black tracking-widest uppercase drop-shadow-md">
                                {loading ? "Alerting..." : (sosCooldown > 0 ? `Wait ${sosCooldown}s` : "SOS Alert")}
                            </span>
                            <span className="text-red-100/70 text-xs font-semibold tracking-wide uppercase text-center px-4">
                                Auto-navigates & Alerts Contacts
                            </span>
                        </motion.button>
                    </motion.div>

                    {/* 🧠 AI SENTINEL TOGGLE */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full mt-4">
                        <button 
                            onClick={() => setAiMode(!aiMode)}
                            className={`w-full py-4 rounded-3xl border transition-all flex items-center justify-center gap-3 relative overflow-hidden ${
                                aiMode 
                                ? "bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]" 
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-400"
                            }`}
                        >
                            {aiMode && <div className="absolute inset-0 bg-amber-500/10 animate-pulse" />}
                            <BrainCircuit className={`w-6 h-6 relative z-10 ${aiMode && 'animate-spin-slow'}`} />
                            <div className="text-left relative z-10">
                                <span className={`block font-black text-sm tracking-widest uppercase ${aiMode ? 'text-amber-400' : 'text-gray-300'}`}>
                                    {aiMode ? "AI Sentinel Active" : "Enable AI Sentinel"}
                                </span>
                                <span className="block text-[10px] opacity-70">
                                    Auto-detects screams & impacts
                                </span>
                            </div>
                            <div className="absolute right-6 flex gap-2 opacity-50">
                                <Mic className="w-4 h-4" />
                                <Activity className="w-4 h-4" />
                            </div>
                        </button>
                    </motion.div>

                    {/* 112 ERSS MODE BUTTON */}
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="w-full mt-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/112")}
                            className="w-full py-5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 border border-indigo-400/50 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(79,70,229,0.3)] group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <ShieldAlert className="w-7 h-7 text-white animate-pulse relative z-10" />
                            <span className="text-white text-lg font-black tracking-[0.15em] uppercase drop-shadow-md relative z-10">
                                Enter 112 ERSS Mode
                            </span>
                        </motion.button>
                    </motion.div>
                </div> {/* END LEFT COLUMN */}

                {/* RIGHT COLUMN: Quick Calls, Shelters, AI */}
                <div className="md:col-span-7 flex flex-col w-full max-w-md mx-auto md:max-w-none">
                    {/* Status Messages */}
                    {message && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`w-full mb-6 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-semibold border backdrop-blur-md shadow-lg ${message.includes('❌') ? 'bg-red-500/10 border-red-500/20 text-red-400' : message.includes('🤖') ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                            <Info className="w-5 h-5 shrink-0" />
                            <p>{message}</p>
                        </motion.div>
                    )}

                    {/* Quick Call Grid */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full grid grid-cols-2 gap-3 mb-6">
                        <QuickCallBtn title="Police" number="100" icon={<ShieldAlert className="w-7 h-7 text-blue-400" />} color="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20" />
                        <QuickCallBtn title="Ambulance" number="102" icon={<HeartPulse className="w-7 h-7 text-rose-400" />} color="bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20" />
                        <QuickCallBtn title="Women Helpline" number="1091" icon={<PhoneCall className="w-7 h-7 text-pink-400" />} color="bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20" />
                        <button onClick={() => { navigator.geolocation.getCurrentPosition((pos) => { const msg = `🚨 I need help! My location: https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`; window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`); }); }} className="flex flex-col items-center justify-center p-3 rounded-[1.25rem] border bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors gap-2 shadow-lg backdrop-blur-sm">
                            <MapPin className="w-6 h-6 text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-50 text-center leading-tight">Share<br />Location</span>
                        </button>
                    </motion.div>

                    {/* 🏠 SHELTERS */}
                    {shelters.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mb-10 space-y-4">
                            <h2 className="text-lg font-bold text-gray-200 flex items-center gap-2 mb-4 px-1">
                                <Navigation className="w-5 h-5 text-indigo-400" /> Nearest Shelters
                            </h2>
                            {shelters.map((s) => (
                                <div key={s.id} className="bg-white/5 border border-white/10 p-4 rounded-[1.25rem] flex justify-between items-center backdrop-blur-md shadow-lg">
                                    <div>
                                        <h3 className="font-bold text-white text-base">{s.name}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5 font-medium">Capacity: <span className="text-gray-300">{s.capacity}</span></p>
                                    </div>
                                    <button onClick={() => window.open(`tel:${s.phone || "100"}`)} className="bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 text-indigo-300 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2">
                                        <PhoneCall className="w-4 h-4" /> Call
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* 🤖 AI HELPER */}
                    <div className="w-full mt-4">
                        <AIHelper />
                    </div>
                </div> {/* END RIGHT COLUMN */}
            </div>
        </div>
    );
}

function QuickCallBtn({ title, number, icon, color }) {
    return (
        <button onClick={() => window.location.href = `tel:${number}`} className={`flex flex-col items-center justify-center p-3 rounded-[1.25rem] border transition-all gap-2 shadow-lg backdrop-blur-sm ${color}`}>
            {icon}
            <span className="text-xs font-bold text-gray-50 text-center leading-tight">
                {title.split(' ').map((word, i) => <span key={i}>{word}<br /></span>)}
            </span>
        </button>
    );
}