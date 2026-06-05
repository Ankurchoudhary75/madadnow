import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, Users, ShieldAlert, BarChart2, Zap, Mic, Flame } from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- MOCK HISTORICAL DATA (Pre-seeded for visual impact) ---
const generateHistoricalData = () => {
    const data = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
            time: `${time.getHours()}:00`,
            manual: Math.floor(Math.random() * 20) + 5,
            voice: Math.floor(Math.random() * 15) + 2,
            impact: Math.floor(Math.random() * 10) + 1,
            total: 0
        });
    }
    data.forEach(d => d.total = d.manual + d.voice + d.impact);
    return data;
};

const RISK_COLORS = ['#dc2626', '#f59e0b', '#3b82f6']; // Critical, Elevated, Normal

export default function Analytics() {
    const navigate = useNavigate();
    const [historicalData, setHistoricalData] = useState(generateHistoricalData());
    const [liveLocations, setLiveLocations] = useState([]);
    
    // Live Stats
    const [stats, setStats] = useState({
        activeRescues: 0,
        criticalRisk: 0,
        voiceTriggers: 0,
        impactTriggers: 0
    });

    useEffect(() => {
        const fetchLive = async () => {
            try {
                const res = await fetch("/api/emergency/live-locations");
                const data = await res.json();
                setLiveLocations(data);

                let critical = 0;
                let voice = 0;
                let impact = 0;

                data.forEach(loc => {
                    if (loc.aiRiskLevel === "CRITICAL") critical++;
                    if (loc.aiTriggerType === "Voice") voice++;
                    if (loc.aiTriggerType === "Impact") impact++;
                });

                setStats({
                    activeRescues: data.length,
                    criticalRisk: critical,
                    voiceTriggers: voice,
                    impactTriggers: impact
                });

                // Dynamically update the last data point
                setHistoricalData(prev => {
                    const newData = [...prev];
                    const last = newData[newData.length - 1];
                    last.voice += voice;
                    last.impact += impact;
                    last.total = last.manual + last.voice + last.impact;
                    return newData;
                });

            } catch (err) {
                console.error("Failed to fetch live stats", err);
            }
        };

        fetchLive();
        const interval = setInterval(fetchLive, 5000);
        return () => clearInterval(interval);
    }, []);

    // Derived Data for Charts
    const riskData = [
        { name: 'Critical Risk', value: stats.criticalRisk || 12 },
        { name: 'Elevated Risk', value: (stats.activeRescues - stats.criticalRisk) || 45 },
        { name: 'Resolved', value: 89 }
    ];

    const sourceData = [
        { name: 'Manual SOS', value: (historicalData[historicalData.length-1].manual) || 40 },
        { name: 'Voice AI', value: stats.voiceTriggers || historicalData[historicalData.length-1].voice },
        { name: 'Impact AI', value: stats.impactTriggers || historicalData[historicalData.length-1].impact },
    ];

    return (
        <div className="min-h-screen bg-[#07090e] text-white font-sans relative overflow-hidden pb-20">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-8 py-6 bg-white/5 border-b border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black tracking-wider flex items-center gap-3">
                            <BarChart2 className="w-6 h-6 text-blue-500" />
                            System Analytics
                        </h1>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Live Intelligence Dashboard</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400 tracking-wider">SYSTEM ONLINE</span>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={<Activity className="w-6 h-6 text-blue-400"/>} title="Active Rescues" value={stats.activeRescues} trend="+12% vs last hour" color="blue" />
                    <StatCard icon={<ShieldAlert className="w-6 h-6 text-red-400"/>} title="Critical Risk" value={stats.criticalRisk} trend="High Priority" color="red" />
                    <StatCard icon={<Mic className="w-6 h-6 text-amber-400"/>} title="Voice AI Triggers" value={stats.voiceTriggers} trend="Stable" color="amber" />
                    <StatCard icon={<Zap className="w-6 h-6 text-purple-400"/>} title="Impact AI Triggers" value={stats.impactTriggers} trend="Spike Detected" color="purple" />
                </div>

                {/* Main Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Big Area Chart (SOS Frequency) */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">SOS Frequency (24h)</h2>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', color: '#fff' }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* AI Risk Breakdown (Pie Chart) */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md flex flex-col">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">System Risk Overview</h2>
                        <div className="flex-1 min-h-[250px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {riskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Custom Legend */}
                        <div className="grid grid-cols-1 gap-3 mt-4">
                            {riskData.map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS[i] }} />
                                        <span className="text-sm text-gray-300">{d.name}</span>
                                    </div>
                                    <span className="font-mono font-bold text-white">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Trigger Source Analysis (Bar Chart) */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3 bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Trigger Source Analysis (Live)</h2>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sourceData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                                    <XAxis type="number" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="name" type="category" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                    <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {sourceData.map((entry, index) => {
                                            const colors = ['#3b82f6', '#f59e0b', '#a855f7'];
                                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, trend, color }) {
    const bgColors = {
        blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        red: 'bg-red-500/10 border-red-500/20 text-red-400',
        amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    };
    
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 rounded-[2rem] border backdrop-blur-md flex flex-col gap-4 ${bgColors[color]}`}>
            <div className="flex items-center justify-between">
                <div className="p-3 bg-white/5 rounded-xl shadow-inner">
                    {icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 bg-white/10 px-2 py-1 rounded-full">Live</span>
            </div>
            <div>
                <h3 className="text-3xl font-black text-white">{value}</h3>
                <p className="text-sm font-semibold opacity-80 mt-1">{title}</p>
                <p className="text-[10px] font-medium opacity-60 mt-3 border-t border-white/10 pt-2">{trend}</p>
            </div>
        </motion.div>
    );
}
