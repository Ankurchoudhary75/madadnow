import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Map, AlertTriangle, ShieldCheck } from "lucide-react";

import moonBg from "../assets/new-moon-bg.png";

export default function Home() {
    const navigate = useNavigate();

    // 🌙 PARALLAX EFFECT (Optimized with Framer Motion values to avoid re-renders)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 100, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Map normalized mouse position (-1 to 1) to percentage for background
    const bgPositionX = useTransform(springX, [-1, 1], ["48%", "52%"]);
    const bgPositionY = useTransform(springY, [-1, 1], ["48%", "52%"]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            // Invert movement so the background moves opposite to the mouse
            mouseX.set(-x);
            mouseY.set(-y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="relative min-h-screen overflow-hidden flex items-center justify-center"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(5, 5, 15, 0.2), rgba(2, 2, 8, 0.7)), url(${moonBg})`,
                backgroundSize: "cover",
                backgroundPositionX: bgPositionX,
                backgroundPositionY: bgPositionY,
            }}
        >
            {/* 🌑 DARK OVERLAY (Subtle) */}
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none"></div>

            {/* 🌫️ MOVING FOG */}
            <motion.div
                animate={{ x: ["-5%", "5%", "-5%"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-[-10%] w-[120%] h-[500px] bg-gradient-to-t from-[#091024] to-transparent blur-[80px] pointer-events-none"
            />

            {/* 🌙 FLOATING MOON GLOW */}
            <motion.div
                animate={{ y: [0, -20, 0], scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[800px] h-[800px] bg-amber-500/10 blur-[120px] rounded-full top-[-250px] pointer-events-none"
            />

            {/* ✨ FLOATING PARTICLES */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-amber-200/20 blur-xl"
                        style={{
                            width: Math.random() * 80 + 20,
                            height: Math.random() * 80 + 20,
                            top: Math.random() * 100 + "%",
                            left: Math.random() * 100 + "%",
                        }}
                        animate={{
                            y: [0, -60, 0],
                            x: [0, Math.random() * 30 - 15, 0],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* ⭐ FLOATING STARS */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 2 + 1 + "px",
                            height: Math.random() * 2 + 1 + "px",
                            top: Math.random() * 100 + "%",
                            left: Math.random() * 100 + "%",
                            opacity: Math.random() * 0.6 + 0.2
                        }}
                        animate={{
                            opacity: [0.1, 1, 0.1],
                            scale: [0.8, 1.3, 0.8],
                        }}
                        transition={{
                            duration: Math.random() * 4 + 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* 🌟 MAIN CONTENT - CINEMATIC LEFT ALIGN */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center h-full px-6 sm:px-12 lg:px-24 pointer-events-auto"
            >
                <div className="max-w-xl">

                    {/* Shield Icon Top */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 15 }}
                        className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                    >
                        <ShieldCheck className="text-amber-200/90 w-8 h-8 drop-shadow-md" />
                    </motion.div>

                    {/* 📝 HEADING */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-50 to-amber-100/80 leading-[1.05] tracking-tight pb-3 drop-shadow-2xl"
                    >
                        You’re not alone.
                        <br />
                        We’re here.
                    </motion.h1>

                    {/* 📝 SUBTEXT */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-indigo-50/80 mt-6 text-xl md:text-2xl font-medium tracking-wide drop-shadow-lg max-w-lg leading-relaxed"
                    >
                        Find verified shelters and immediate emergency assistance near you.
                    </motion.p>

                    {/* 🔘 BUTTONS */}
                    <div className="mt-12 space-y-5 max-w-sm">
                        {/* 🚨 SOS BUTTON */}
                        <motion.button
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            animate={{
                                boxShadow: [
                                    "0 0 15px rgba(220, 38, 38, 0.4)",
                                    "0 0 40px rgba(220, 38, 38, 0.7)",
                                    "0 0 15px rgba(220, 38, 38, 0.4)"
                                ]
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            onClick={() => navigate("/emergency")}
                            className="relative w-full py-5 px-8 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xl font-bold flex items-center justify-center gap-3 overflow-hidden shadow-2xl shadow-red-900/40"
                        >
                            <AlertTriangle className="w-6 h-6" />
                            I Need Urgent Help
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                        </motion.button>

                        {/* 🏠 SHELTERS */}
                        <motion.button
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/shelters")}
                            className="group/btn relative w-full py-5 px-8 rounded-2xl bg-black/20 hover:bg-black/40 border border-white/20 text-white text-xl font-semibold shadow-xl backdrop-blur-xl transition-all flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <Map className="w-6 h-6 text-indigo-300 group-hover/btn:text-white transition-colors" />
                            Explore Shelters
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                        </motion.button>
                    </div>

                    {/* ✨ FOOTER */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 flex items-center justify-start gap-4 text-indigo-200/50 text-xs font-bold uppercase tracking-[0.25em]"
                    >
                        <span>Safe</span>
                        <span className="w-1 h-1 bg-indigo-300/40 rounded-full" />
                        <span>Fast</span>
                        <span className="w-1 h-1 bg-indigo-300/40 rounded-full" />
                        <span>Reliable</span>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}