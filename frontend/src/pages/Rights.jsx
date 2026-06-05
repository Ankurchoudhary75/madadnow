import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Scale, HeartPulse, Info, UserCheck, ShieldAlert, FileText, 
    ChevronRight, X, AlertTriangle, Send, CheckCircle2 
} from "lucide-react";

export default function Rights() {
    const [selectedRight, setSelectedRight] = useState(null);
    const [isReporting, setIsReporting] = useState(false);
    const [reportStatus, setReportStatus] = useState("idle"); // idle, submitting, success

    const rightsData = [
        {
            icon: <Scale className="w-8 h-8 text-emerald-400" />,
            title: "Right to Shelter",
            desc: "Every displaced person has the absolute right to safe shelter, clean drinking water, food rations, and sanitation provided by the government without delay.",
            gradient: "from-emerald-500/20 to-teal-500/5",
            border: "border-emerald-500/30",
            details: {
                laws: "Under Article 21 (Right to Life) and the National Disaster Management Act (2005).",
                action: "If denied entry to a relief camp, document the refusal. Authorities cannot turn away citizens affected by the disaster due to overcrowding without providing alternatives.",
                contact: "Contact the District Magistrate's emergency cell or the National Human Rights Commission helpline."
            }
        },
        {
            icon: <HeartPulse className="w-8 h-8 text-rose-400" />,
            title: "Right to Healthcare",
            desc: "Immediate, unconditional, and free medical treatment must be provided in case of injury or illness during a disaster. Private hospitals cannot refuse emergency care.",
            gradient: "from-rose-500/20 to-pink-500/5",
            border: "border-rose-500/30",
            details: {
                laws: "Supreme Court rulings under Article 21 mandate that preservation of human life is paramount. Clinical Establishments Act.",
                action: "If a private hospital demands advance payment during a disaster emergency, inform them you will file a police FIR. They are legally bound to stabilize the patient first.",
                contact: "Call 104 (Health Helpline) or the local Chief Medical Officer."
            }
        },
        {
            icon: <Info className="w-8 h-8 text-blue-400" />,
            title: "Right to Information",
            desc: "You have the legal right to receive timely, accurate warnings, and transparent information regarding rescue operations, safe zones, and government assistance funds.",
            gradient: "from-blue-500/20 to-cyan-500/5",
            border: "border-blue-500/30",
            details: {
                laws: "Right to Information (RTI) Act 2005. Section 4 mandates proactive disclosure by public authorities.",
                action: "You can demand to see the list of relief materials disbursed and the criteria for compensation. Transparency in disaster relief cannot be withheld citing 'state secrets'.",
                contact: "State Information Commission or the local nodal disaster officer."
            }
        },
        {
            icon: <UserCheck className="w-8 h-8 text-amber-400" />,
            title: "Right to Dignity",
            desc: "All rescue, relief, and rehabilitation operations must be provided without any discrimination based on caste, religion, gender, or economic status.",
            gradient: "from-amber-500/20 to-yellow-500/5",
            border: "border-amber-500/30",
            details: {
                laws: "Article 15 of the Constitution (Prohibition of discrimination).",
                action: "If you witness segregated relief lines or denial of rations based on identity, take video evidence if safe to do so. This is a severe criminal offense.",
                contact: "National Commission for Minorities, SC/ST Commission, or nearest Police Superintendent."
            }
        },
        {
            icon: <ShieldAlert className="w-8 h-8 text-indigo-400" />,
            title: "Protection of Vulnerable Groups",
            desc: "Special provisions and priority rescue efforts must be made for children, women, the elderly, and persons with disabilities to ensure their absolute safety.",
            gradient: "from-indigo-500/20 to-purple-500/5",
            border: "border-indigo-500/30",
            details: {
                laws: "Rights of Persons with Disabilities Act (2016) Section 8, and Juvenile Justice Act.",
                action: "Relief camps must have separate, safe, and private washrooms for women, and ramps/accessible areas for the disabled. If absent, you can formally demand immediate rectification.",
                contact: "National Commission for Women, Childline (1098)."
            }
        }
    ];

    const handleReportSubmit = (e) => {
        e.preventDefault();
        setReportStatus("submitting");
        
        // Simulate network request
        setTimeout(() => {
            setReportStatus("success");
            // Auto close after showing success
            setTimeout(() => {
                setIsReporting(false);
                setReportStatus("idle");
            }, 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#07090e] text-white font-sans relative overflow-x-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-teal-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="px-6 py-12 md:px-12 max-w-7xl mx-auto relative z-10 pb-32">
                
                {/* Hero Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4">
                        <FileText className="w-3.5 h-3.5" />
                        Constitutional Rights
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Know Your <span className="text-emerald-400">Rights</span>
                    </h1>
                    <p className="text-gray-400 text-base md:text-xl max-w-2xl leading-relaxed">
                        During times of crisis, the law protects you. Familiarize yourself with these non-negotiable legal entitlements guaranteed to all citizens during disasters.
                    </p>
                </motion.div>

                {/* Rights Grid */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
                >
                    {rightsData.map((right, index) => (
                        <motion.div 
                            key={index}
                            onClick={() => setSelectedRight(right)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group bg-white/5 backdrop-blur-md rounded-[2rem] p-6 md:p-8 border border-white/10 overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:border-white/20 cursor-pointer`}
                        >
                            {/* Card Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${right.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start gap-5 mb-5">
                                    <div className={`p-4 rounded-2xl bg-black/40 border ${right.border} shadow-inner`}>
                                        {right.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mt-2 leading-tight tracking-tight text-gray-100">
                                        {right.title}
                                    </h3>
                                </div>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base flex-grow">
                                    {right.desc}
                                </p>
                                
                                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-gray-500 group-hover:text-white transition-colors">
                                    Learn more details <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    {/* Legal Help CTA */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-indigo-900/60 to-black backdrop-blur-md rounded-[2rem] p-6 md:p-8 border border-indigo-500/30 flex flex-col justify-center items-center text-center shadow-[0_10px_40px_rgba(99,102,241,0.15)]"
                    >
                        <ShieldAlert className="w-12 h-12 text-indigo-400 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Denied your rights?</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            If authorities are failing to provide mandated relief, you have the right to file an urgent grievance.
                        </p>
                        <button 
                            onClick={() => setIsReporting(true)}
                            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto"
                        >
                            Report Violation
                        </button>
                    </motion.div>
                </motion.div>

            </div>

            {/* MODALS */}
            <AnimatePresence>
                
                {/* 1. Right Detail Modal */}
                {selectedRight && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRight(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className={`relative w-full max-w-lg bg-gray-900 border ${selectedRight.border} rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden`}
                        >
                            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${selectedRight.gradient.replace('/20', '').replace('/5', '')}`} />
                            
                            <button 
                                onClick={() => setSelectedRight(null)}
                                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4 mb-6 mt-2">
                                <div className={`p-3 rounded-xl bg-black/40 border ${selectedRight.border}`}>
                                    {selectedRight.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-white leading-tight">{selectedRight.title}</h2>
                            </div>

                            <div className="space-y-6 text-sm md:text-base">
                                <div>
                                    <h4 className="text-emerald-400 font-bold mb-1 uppercase tracking-wider text-xs">Legal Backing</h4>
                                    <p className="text-gray-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{selectedRight.details.laws}</p>
                                </div>
                                <div>
                                    <h4 className="text-amber-400 font-bold mb-1 uppercase tracking-wider text-xs">If Denied: What to do</h4>
                                    <p className="text-gray-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{selectedRight.details.action}</p>
                                </div>
                                <div>
                                    <h4 className="text-indigo-400 font-bold mb-1 uppercase tracking-wider text-xs">Who to Contact</h4>
                                    <p className="text-gray-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">{selectedRight.details.contact}</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedRight(null)}
                                className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                            >
                                Understood
                            </button>
                        </motion.div>
                    </div>
                )}

                {/* 2. Report Violation Form Modal */}
                {isReporting && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => reportStatus !== "submitting" && setIsReporting(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-gray-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
                        >
                            {reportStatus === "success" ? (
                                <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center justify-center text-center py-8"
                                >
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Report Submitted</h2>
                                    <p className="text-gray-400">Your grievance has been securely logged with the Human Rights desk. A reference number will be sent via SMS shortly.</p>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                                            File Grievance
                                        </h2>
                                        <button 
                                            onClick={() => setIsReporting(false)}
                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleReportSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Violation Type</label>
                                            <select required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none">
                                                <option value="" disabled selected>Select the issue...</option>
                                                <option value="shelter">Denied Entry to Shelter</option>
                                                <option value="medical">Refused Medical Treatment</option>
                                                <option value="discrimination">Discrimination in Relief</option>
                                                <option value="corruption">Demand for Bribe/Corruption</option>
                                                <option value="other">Other Violation</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Location / Hospital Name</label>
                                            <input required type="text" placeholder="e.g. City General Hospital" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Describe what happened</label>
                                            <textarea required rows={4} placeholder="Provide specific details about who denied you your rights..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600 resize-none" />
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={reportStatus === "submitting"}
                                            className={`w-full mt-4 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                                reportStatus === "submitting" 
                                                ? "bg-indigo-600/50 text-indigo-200 cursor-wait" 
                                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                            }`}
                                        >
                                            {reportStatus === "submitting" ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>Submit Official Report <Send className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}