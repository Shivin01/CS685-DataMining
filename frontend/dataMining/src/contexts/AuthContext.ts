// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    token: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    signup: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const API_URL = 'http://localhost:8000'; // Replace with your FastAPI backend URL

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const setAuthToken = (token: string | null) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    };

    const signup = async (email: string, password: string): Promise<void> => {
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password });
            const { access_token } = response.data;
            setAuthToken(access_token);
            setUser({ token: access_token });
        } catch (error) {
            throw error;
        }
    };

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { access_token } = response.data;
            setAuthToken(access_token);
            setUser({ token: access_token });
        } catch (error) {
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await axios.post(`${API_URL}/logout`);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAuthToken(null);
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};