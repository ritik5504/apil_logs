import React, { createContext, useContext, useEffect, useState } from "react";
import {
    loginUser, 
    registerUser, 
    verifyEmailOtp, 
    logoutEverywhere,
} from "../api/auth.api";

import { setToken, getToken, removeToken } from "../utils/token";

const AuthContext = createContext(null);

// Provider
export const AuthProvider =  ({ children })=> {
    const [user, setUser ] = useState(null);
    const [accessToken, setAccessToken] = useState(getToken());
    const [loading, setLoading] = useState(true);

    // restore session on refresh
    useEffect(() => {
        const initAuth = async () => {
            // If there is no access token, nothing to restore
            if (!accessToken) {
                setLoading(false);
                return;
            }
            // We are not persisting a refresh token yet, so skip server refresh to avoid "Missing token"
            // Keep the current accessToken in memory and finish loading
            setLoading(false);
        };

        initAuth();
    }, []);

    // Action
    const login = async (payload) => {
        const data = await loginUser(payload);
        setAccessToken(data.accessToken);
        setToken(data.accessToken);
        setUser(data.user);
        return data;
    }

    const register = async (payload) => {
        return await registerUser(payload);
    };

    const verifyEmail = async (payload) => {
        return await verifyEmailOtp(payload);
    };

    const logout = async () => {
        try {
            if(accessToken) {
                await logoutEverywhere(accessToken);
            }
        } finally {
            removeToken();
            setAccessToken(null);
            setUser(null);
        }
    };

    const loginwithTokens = (data) => {
        setAccessToken(data.accessToken);
        setToken(data.accessToken);
        setUser(data.user || null);
    } 



    // Mistake: The isAuthenticated value is set using `!accessToken`, which means when there is NO accessToken, `isAuthenticated` is true (because !accessToken is true when accessToken is null/undefined). This is the opposite of what you usually want. Typically, isAuthenticated should be true when you HAVE an accessToken.
    // Fix: Use !!accessToken (double negation) instead of !accessToken.

    // Context value
    const value = {
        user, 
        accessToken, 
        loading, 
        isAuthenticated: !!accessToken, // <-- FIXED: Now true if accessToken exists
        login, 
        register, 
        verifyEmail, 
        logout,
        loginwithTokens
    };

    return (
        <AuthContext.Provider value={value}> 
        {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);