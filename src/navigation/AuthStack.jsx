import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                setUser({ token }); // ✅ Setting user correctly
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (token) => {
        await SecureStore.setItemAsync("token", token);
        setUser({ token });
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
