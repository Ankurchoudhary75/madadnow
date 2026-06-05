import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from local storage on mount
        const storedUser = localStorage.getItem("madadnow_user_auth");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        const fullUser = {
            id: Date.now(),
            ...userData,
        };
        setUser(fullUser);
        localStorage.setItem("madadnow_user_auth", JSON.stringify(fullUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("madadnow_user_auth");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
