import { Link, useLocation } from "react-router-dom";
import { Home, Shield, BookOpen, User } from "lucide-react";

export default function BottomNav() {
    const loc = useLocation();

    // Hide navigation entirely on login page
    if (loc.pathname === "/login") return null;

    const activeLink = (path) =>
        loc.pathname === path ? "text-indigo-400 font-bold" : "text-gray-400 hover:text-indigo-300";

    const activeIcon = (path) =>
        loc.pathname === path ? "text-indigo-400" : "text-gray-400";

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-gray-900/90 backdrop-blur-lg border-t border-white/10 z-50 md:fixed md:top-0 md:bottom-auto md:border-t-0 md:border-b md:bg-black/80 md:py-4">
            <div className="max-w-7xl mx-auto flex justify-around md:justify-between items-center px-6 py-3 md:py-0">

                {/* Desktop Logo (Hidden on mobile) */}
                <div className="hidden md:block">
                    <Link to="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                        <Shield className="w-8 h-8 text-rose-500" />
                        Madad<span className="text-rose-500">Now</span>
                    </Link>
                </div>

                {/* Nav Links */}
                <div className="flex justify-around w-full md:w-auto md:gap-10">
                    <Link className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-colors ${activeLink("/")}`} to="/">
                        <Home className={`w-6 h-6 md:w-5 md:h-5 ${activeIcon("/")}`} />
                        <span className="text-[10px] md:text-sm uppercase tracking-wide">Home</span>
                    </Link>
                    <Link className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-colors ${activeLink("/shelters")}`} to="/shelters">
                        <BookOpen className={`w-6 h-6 md:w-5 md:h-5 ${activeIcon("/shelters")}`} />
                        <span className="text-[10px] md:text-sm uppercase tracking-wide">Resources</span>
                    </Link>
                    <Link className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-colors ${activeLink("/rights")}`} to="/rights">
                        <Shield className={`w-6 h-6 md:w-5 md:h-5 ${activeIcon("/rights")}`} />
                        <span className="text-[10px] md:text-sm uppercase tracking-wide">Rights</span>
                    </Link>
                    <Link className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-colors ${activeLink("/profile")}`} to="/profile">
                        <User className={`w-6 h-6 md:w-5 md:h-5 ${activeIcon("/profile")}`} />
                        <span className="text-[10px] md:text-sm uppercase tracking-wide">Profile</span>
                    </Link>
                </div>

            </div>
        </nav>
    );
}