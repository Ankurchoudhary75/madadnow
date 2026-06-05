import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { lazy, Suspense, useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WifiOff, ShieldCheck } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-red-500 p-10 font-mono">
          <h1 className="text-2xl font-bold mb-4">Application Crashed</h1>
          <pre className="bg-red-900/20 p-4 rounded-xl border border-red-500/30 overflow-auto">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.href = '/admin'}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import Home from "./pages/Home";
import Shelters from "./pages/Shelters";
import Emergency from "./pages/Emergency";
import Emergency112 from "./pages/Emergency112";
import Resources from "./pages/Resources";
import Rights from "./pages/Rights";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
const Analytics = lazy(() => import("./pages/Analytics"));
import LiveTracking from "./pages/LiveTracking";
import Login from "./pages/Login";
import BottomNav from "./components/BottomNav";
import WeatherAlert from "./components/WeatherAlert";

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
}

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncMessage, setSyncMessage] = useState(null);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      
      // Flush Offline SOS Queue
      const queue = JSON.parse(localStorage.getItem('offline_sos_queue') || '[]');
      if (queue.length > 0) {
        let successCount = 0;
        for (const payload of queue) {
          try {
            await fetch("/api/emergency/update-location", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            successCount++;
          } catch (err) {
            console.error("Failed to sync queued SOS", err);
          }
        }
        if (successCount === queue.length) {
          localStorage.removeItem('offline_sos_queue');
          setSyncMessage(`Synced ${successCount} offline emergency signals!`);
          setTimeout(() => setSyncMessage(null), 5000);
        } else {
          // Keep failures in queue
          localStorage.setItem('offline_sos_queue', JSON.stringify(queue.slice(successCount)));
        }
      }
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-black text-white flex flex-col">
          
          {/* Offline Banner */}
          {!isOnline && (
            <div className="bg-red-600 text-white p-2 text-center text-sm font-bold flex items-center justify-center gap-2 z-[9999] relative">
              <WifiOff className="w-4 h-4" /> OFFLINE EMERGENCY MODE ACTIVE - SOS will be queued locally.
            </div>
          )}
          {/* Sync Success Banner */}
          {syncMessage && (
            <div className="bg-emerald-600 text-white p-2 text-center text-sm font-bold flex items-center justify-center gap-2 z-[9999] relative animate-pulse">
              <ShieldCheck className="w-4 h-4" /> {syncMessage}
            </div>
          )}

          <WeatherAlert />

          {/* MAIN CONTENT */}
          <div className="flex-1 pb-24 md:pb-0 md:pt-20">

            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/112" element={<Emergency112 />} />

              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/shelters" element={<ProtectedRoute><Shelters /></ProtectedRoute>} />
              <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
              <Route path="/rights" element={<ProtectedRoute><Rights /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Analytics...</div>}><Analytics /></Suspense></ProtectedRoute>} />
              <Route path="/live-tracking" element={<ProtectedRoute><LiveTracking /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>

          </div>

          {/* 🔻 RESPONSIVE NAV (Top on Desktop, Bottom on Mobile) */}
          <BottomNav />

        </div>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
}