import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Activity, AlertTriangle, ShieldPlus } from "lucide-react";

export default function AIHelper() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am your AI Emergency Assistant. Tell me what's wrong, or tap a quick action below.", sender: "ai" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);

    // Auto-scroll to bottom of chat safely
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, isTyping]);

    // Pre-defined quick actions
    const quickActions = [
        "Someone is bleeding",
        "How to do CPR",
        "Earthquake started",
        "House on fire"
    ];

    // Advanced Rule-Based Emergency Engine
    const generateResponse = (query) => {
        const q = query.toLowerCase();
        
        // MEDICAL EMERGENCIES
        if (q.includes("bleed") || q.includes("cut")) {
            return "🩸 **SEVERE BLEEDING:**\n1. Apply direct, firm pressure to the wound with a clean cloth.\n2. Keep pressing hard. Do not remove the cloth to check.\n3. Elevate the injured area above the heart if possible.\n4. If bleeding doesn't stop, apply a tourniquet 2-3 inches above the wound.";
        }
        if (q.includes("cpr") || q.includes("heart") || q.includes("not breathing")) {
            return "❤️ **CPR INSTRUCTIONS:**\n1. Lay the person flat on their back.\n2. Place the heel of one hand in the center of their chest, other hand on top.\n3. Push hard and fast (2 inches deep, 100-120 pushes per minute).\n4. Do not stop until help arrives or they wake up.";
        }
        if (q.includes("chok")) {
            return "🗣️ **CHOKING:**\n1. Stand behind them and wrap your arms around their waist.\n2. Make a fist just above their belly button.\n3. Grab your fist with your other hand and give 5 quick, upward thrusts (Heimlich maneuver).\n4. Repeat until the object pops out.";
        }
        if (q.includes("burn") || q.includes("scald")) {
            return "🔥 **BURNS:**\n1. Run cool (not ice cold) water over the burn for 10-15 minutes.\n2. Do NOT apply ice, butter, or ointments immediately.\n3. Cover loosely with a sterile, non-stick bandage or clean cloth.\n4. Seek medical help if the burn is severe or larger than 3 inches.";
        }
        if (q.includes("poison")) {
            return "☠️ **POISONING:**\n1. Try to identify what was swallowed and how much.\n2. Do NOT induce vomiting unless told to do so by poison control.\n3. Call Poison Control or Emergency Services immediately.\n4. Keep the container or bottle of the poison to show responders.";
        }

        // DISASTERS
        if (q.includes("earthquake") || q.includes("tremor") || q.includes("shaking")) {
            return "🌍 **EARTHQUAKE:**\n1. DROP to your hands and knees.\n2. COVER your head and neck under a sturdy table or desk.\n3. HOLD ON to your shelter until shaking stops.\n4. Stay away from glass, windows, and outside doors.";
        }
        if (q.includes("fire") || q.includes("smoke")) {
            return "🚨 **FIRE:**\n1. Get out immediately. Do not hide.\n2. If there is smoke, crawl low to the ground where air is cleaner.\n3. Feel doors with the back of your hand before opening. If hot, find another way out.\n4. Call emergency services from outside. NEVER go back inside.";
        }
        if (q.includes("flood") || q.includes("water")) {
            return "🌊 **FLOOD:**\n1. Move to higher ground immediately.\n2. Do not walk or drive through flood waters (6 inches of moving water can knock you down).\n3. Turn off main utilities if you have time.\n4. Avoid floodwater as it may be electrically charged or contaminated.";
        }

        // GENERAL
        if (q.includes("hello") || q.includes("hi")) {
            return "Hello. Please let me know what your emergency is so I can provide immediate instructions.";
        }

        return "I am an AI assistant trained for emergencies. I couldn't understand your exact situation. Please try to be specific: say 'Fire', 'Bleeding', 'CPR', or 'Earthquake' for immediate guidance.";
    };

    const handleSend = (text = input) => {
        if (!text.trim()) return;

        // Add user message
        const newMsg = { id: Date.now(), text, sender: "user" };
        setMessages(prev => [...prev, newMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI thinking and reply
        setTimeout(() => {
            const aiResponseText = generateResponse(text);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponseText, sender: "ai" }]);
            setIsTyping(false);
        }, 800); // 800ms delay for realism
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    // Format bold text
    const formatText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="text-white font-black">{part.slice(2, -2)}</strong>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="w-full h-[380px] bg-white/5 border border-white/10 rounded-[1.5rem] shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden relative">
            
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-black/20 flex items-center gap-3 relative z-10">
                <div className="bg-indigo-500/20 p-2 rounded-xl">
                    <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
                        First-Aid AI <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </h3>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium uppercase tracking-wider">
                        <Activity className="w-3 h-3" /> Online
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth text-sm">
                <AnimatePresence>
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex w-full ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[85%] rounded-2xl p-3 shadow-lg ${
                                m.sender === "user" 
                                ? "bg-indigo-600 text-white rounded-tr-sm" 
                                : "bg-black/40 border border-white/5 text-gray-200 rounded-tl-sm whitespace-pre-line leading-relaxed"
                            }`}>
                                {formatText(m.text)}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex w-full justify-start"
                    >
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-3 rounded-tl-sm flex gap-1.5 items-center">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Quick Actions */}
            {messages.length < 3 && !isTyping && (
                <div className="px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                    {quickActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(action)}
                            className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-gray-300 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                        >
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            {action}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/20">
                <div className="relative flex items-center">
                    <input
                        className="w-full bg-black/40 border border-white/10 focus:border-indigo-500 rounded-full py-2.5 pl-4 pr-12 text-white text-sm focus:outline-none transition-colors shadow-inner"
                        placeholder="Describe emergency..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={() => handleSend(input)}
                        disabled={!input.trim()}
                        className="absolute right-1.5 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 rounded-full text-white transition-colors"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
            
        </div>
    );
}