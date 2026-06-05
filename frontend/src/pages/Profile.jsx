import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    User, Settings, FileText, Phone, Edit3, Check, X,
    LogOut, Plus, Shield, MapPin, Bell, UploadCloud
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Load from global state or default
    const [user, setUser] = useState(authUser || {
        name: "Ankur Choudhary",
        phone: "+91-9876543210",
        email: "ankur@example.com",
        bloodGroup: "O+"
    });

    const [contacts, setContacts] = useState(() => {
        const saved = localStorage.getItem("madadnow_contacts");
        return saved ? JSON.parse(saved) : [
            { id: 1, name: "Mom", phone: "+91-9123456789" }
        ];
    });

    const [documents, setDocuments] = useState(() => {
        const saved = localStorage.getItem("madadnow_docs");
        return saved ? JSON.parse(saved) : [];
    });

    // Settings States
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem("madadnow_settings");
        return saved ? JSON.parse(saved) : {
            locationSharing: true,
            notifications: true,
            generalAlerts: false
        };
    });

    // Temp state for editing
    const [editForm, setEditForm] = useState(user);
    const fileInputRef = useRef(null);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("madadnow_user", JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem("madadnow_contacts", JSON.stringify(contacts));
    }, [contacts]);

    useEffect(() => {
        localStorage.setItem("madadnow_docs", JSON.stringify(documents));
    }, [documents]);

    useEffect(() => {
        localStorage.setItem("madadnow_settings", JSON.stringify(settings));
    }, [settings]);

    const handleSaveProfile = () => {
        setUser(editForm);
        setIsEditing(false);
    };

    const handleAddContact = () => {
        const name = prompt("Enter contact name:");
        const phone = prompt("Enter contact phone number:");
        if (name && phone) {
            setContacts([...contacts, { id: Date.now(), name, phone }]);
        }
    };

    const handleRemoveContact = (id) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const handleUploadDoc = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocuments([...documents, { id: Date.now(), name: file.name, date: new Date().toLocaleDateString() }]);
        }
    };

    const handleRemoveDoc = (id) => {
        setDocuments(documents.filter(d => d.id !== id));
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="bg-[#07090e] text-white min-h-screen font-sans relative overflow-x-hidden">

            {/* Ambient Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-[40%] right-[-10%] w-[300px] h-[300px] bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Header Section */}
            <div className="relative z-10 px-6 pt-12 pb-8 bg-white/5 backdrop-blur-xl border-b border-white/10 rounded-b-[2rem] shadow-lg max-w-7xl mx-auto md:px-12 md:rounded-[2rem] md:mt-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
                    {!isEditing ? (
                        <button
                            onClick={() => { setEditForm(user); setIsEditing(true); }}
                            className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-colors border border-white/10 shadow-lg"
                        >
                            <Edit3 className="w-5 h-5 text-indigo-300" />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 p-2.5 rounded-xl transition-colors border border-red-500/20 shadow-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 p-2.5 rounded-xl transition-colors border border-emerald-500/20 shadow-lg"
                            >
                                <Check className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-indigo-400/30">
                            <User className="w-12 h-12 text-white" />
                        </div>
                        {isEditing && (
                            <div className="absolute bottom-0 right-0 bg-gray-800 p-1.5 rounded-full border border-gray-600 shadow-lg cursor-pointer">
                                <Edit3 className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="flex-1 space-y-2 max-w-md">
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xl font-bold text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Full Name"
                            />
                            <input
                                type="text"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-indigo-200 focus:outline-none focus:border-indigo-500"
                                placeholder="Phone Number"
                            />
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-3xl font-bold">{user.name}</h2>
                            <p className="text-indigo-200 font-medium flex items-center gap-2 mt-1.5 text-lg">
                                <Phone className="w-4 h-4" /> {user.phone}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="relative z-10 px-6 mt-8 space-y-6 max-w-2xl mx-auto md:max-w-7xl md:px-12 md:grid md:grid-cols-12 md:gap-10 md:space-y-0">

                {/* LEFT COLUMN: Docs & Contacts (col-span-8) */}
                <div className="md:col-span-7 lg:col-span-8 space-y-6">
                    {/* Emergency Contacts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-[1.5rem] p-5 shadow-lg backdrop-blur-md"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Shield className="w-5 h-5 text-rose-400" />
                                Emergency Contacts
                            </h3>
                            <button
                                onClick={handleAddContact}
                                className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 p-2 rounded-lg transition-colors border border-indigo-500/30 shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {contacts.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">No emergency contacts added.</p>
                        ) : (
                            <div className="space-y-3">
                                {contacts.map((contact) => (
                                    <div key={contact.id} className="flex justify-between items-center bg-black/30 p-3.5 rounded-2xl border border-white/5 shadow-inner">
                                        <div>
                                            <p className="font-semibold text-white">{contact.name}</p>
                                            <p className="text-sm text-gray-400 mt-0.5">{contact.phone}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveContact(contact.id)}
                                            className="text-red-400 hover:text-red-300 p-2 bg-red-500/10 rounded-xl transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Documents Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-[1.5rem] p-5 shadow-lg backdrop-blur-md"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-emerald-400" />
                                Important Documents
                            </h3>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 p-2 rounded-lg transition-colors border border-emerald-500/30 shadow-md"
                            >
                                <UploadCloud className="w-4 h-4" />
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleUploadDoc} />
                        </div>

                        {documents.length === 0 ? (
                            <div className="text-center py-6 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                                <p className="text-gray-400 text-sm">Upload IDs or medical records securely.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="flex justify-between items-center bg-black/30 p-3.5 rounded-2xl border border-white/5 shadow-inner">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className="bg-emerald-500/20 p-2.5 rounded-xl">
                                                <FileText className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div className="truncate">
                                                <p className="font-semibold text-sm truncate w-40 text-white">{doc.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{doc.date}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveDoc(doc.id)}
                                            className="text-red-400 hover:text-red-300 p-2 shrink-0 bg-red-500/10 rounded-xl transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* RIGHT COLUMN: Settings (col-span-4) */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col mt-6 md:mt-0">
                    {/* Settings Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-[1.5rem] shadow-lg backdrop-blur-md overflow-hidden"
                    >
                        <SettingsToggle 
                            icon={<MapPin className="w-5 h-5 text-blue-400" />} 
                            label="Location Sharing" 
                            isActive={settings.locationSharing}
                            onToggle={() => toggleSetting("locationSharing")}
                        />
                        <div className="h-[1px] w-full bg-white/10" />
                        <SettingsToggle 
                            icon={<Bell className="w-5 h-5 text-amber-400" />} 
                            label="Push Notifications" 
                            isActive={settings.notifications}
                            onToggle={() => toggleSetting("notifications")}
                        />
                        <div className="h-[1px] w-full bg-white/10" />
                        <SettingsToggle 
                            icon={<Settings className="w-5 h-5 text-gray-400" />} 
                            label="Data Saver Mode" 
                            isActive={settings.generalAlerts}
                            onToggle={() => toggleSetting("generalAlerts")}
                        />
                    </motion.div>

                    {/* Logout Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        className="w-full py-4 mt-6 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors shadow-lg backdrop-blur-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout Securely
                    </motion.button>
                </div>

            </div>
        </div>
    );
}

function SettingsToggle({ icon, label, isActive, onToggle }) {
    return (
        <div className="w-full flex justify-between items-center p-5 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
                <div className="bg-white/5 p-2 rounded-lg border border-white/5 shadow-inner">
                    {icon}
                </div>
                <span className="font-semibold text-gray-200">{label}</span>
            </div>
            
            {/* Custom Toggle Switch */}
            <button 
                onClick={onToggle}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isActive ? 'bg-indigo-600' : 'bg-gray-700'}`}
            >
                <motion.div 
                    initial={false}
                    animate={{ 
                        x: isActive ? 24 : 2, 
                        backgroundColor: isActive ? "#ffffff" : "#9ca3af" 
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 left-0 w-4 h-4 rounded-full shadow-md"
                />
            </button>
        </div>
    );
}