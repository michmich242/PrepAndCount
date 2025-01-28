import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync("token");
                if (storedToken) {
                    setUser({ token: JSON.parse(storedToken) || storedToken });
                }
            } catch (error) {
                console.error("Error loading user:", error);
            }
            setLoading(false);
        };
        loadUser();
    }, []);
    

    const login = async (token) => {
        try {
            const tokenString = typeof token === "string" ? token : JSON.stringify(token);
            await SecureStore.setItemAsync("token", tokenString);
            setUser({ token });
        } catch (error) {
            console.error("Login failed:", error);
        }
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
