import React, {createContext, useEffect, useState} from "react";
import {UserProfile} from "~/Models/User.ts";
import {toast} from "react-toastify";
import {getAxiosInstance} from "~/axiosInstance.ts";

const axios = getAxiosInstance()

type dataType = {
    user: string
    expires_at: number
    id: number
    refresh_token: string
    token: string
    training: boolean
}

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    refreshToken: string | null;
    expiresAt: string | null;
    registerUser: (data: dataType) => void;
    loginUser: (data: dataType) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
}


type Props = { children: React.ReactNode }

const UserContext = createContext<UserContextType>({} as UserContextType);
/*
   TODO:
       1. Add if username and password doesn't match toast.
       2. Add if email already registered toast error message in register.
  */


export const UserProvider = ({children}: Props) => {
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshTokenToken] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [train, setTrain] = useState<string | null>("false")
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        const expiresAt = localStorage.getItem("expiresAt");
        const train = localStorage.getItem("train")
        if (user && token && refreshToken && expiresAt) {
            setUser(JSON.parse(user));
            setToken(token);
            setRefreshTokenToken(refreshToken)
            setExpiresAt(expiresAt)
            setTrain(train)
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        setIsReady(true);
    }, []);

    const localStorageToken = (data: dataType) => {
        localStorage.setItem("token", data.token)
        const userObj = {
            email: data.user,
            id: data.id.toString()
        }
        localStorage.setItem("user", JSON.stringify(userObj));
        localStorage.setItem("refreshToken", data.refresh_token);
        localStorage.setItem("expiresAt", data.expires_at.toString());
        localStorage.setItem("train", data.training.toString());
        setToken(data.token);
        setUser(userObj!);
        setRefreshTokenToken(data.refresh_token)
        setExpiresAt(data.expires_at.toString())
        setTrain(train)
        axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
    }

    const registerUser = (data: dataType) => {
        localStorageToken(data);
        toast.success("Registered User Successfully!");
    }

    const loginUser = (data: dataType) => {
        localStorageToken(data);
        toast.success("Login Success!");
    }

    const isLoggedIn = () => {
        return !!user;
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresAt");
        setUser(null);
        setRefreshTokenToken("");
        setExpiresAt("");
        setToken("")
    }

    return (
        <UserContext.Provider
            value={{loginUser, user, token, refreshToken, expiresAt, logout, isLoggedIn, registerUser}}>
            {isReady ? children : null}
        </UserContext.Provider>
    )
};

export const useAuth = () => React.useContext(UserContext);