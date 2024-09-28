import React, {createContext, useEffect, useState} from "react";
import {UserProfile} from "~/Models/User.ts";
import {toast} from "react-toastify";
import {getAxiosInstance} from "~/axiosInstance.ts";

const axios = getAxiosInstance()

type dataType = {
    user: string
    email: string
    id: number
    access_token: string
}

type UserContextType = {
    user: UserProfile | null;
    email: string | null;
    token: string | null;
    registerUser: (data: dataType) => void;
    loginUser: (data: dataType) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
}


type Props = { children: React.ReactNode }

const UserContext = createContext<UserContextType>({} as UserContextType);


export const UserProvider = ({children}: Props) => {
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false)
    useEffect(() => {
        const user = localStorage.getItem("user");
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        if ( user && email && token) {
            setUser(JSON.parse(user));
            setEmail(email);
            setToken(token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        setIsReady(true);
    }, []);

    const localStorageToken = (data: dataType) => {
        localStorage.setItem("token", data.access_token)
        const userObj = {
            email: data.user,
            id: data.id.toString()
        }
        localStorage.setItem("user", JSON.stringify(userObj));
        localStorage.setItem("email", data.email);
        setToken(data.access_token);
        setUser(userObj!);
        axios.defaults.headers.common["Authorization"] = "Bearer " + data.access_token;
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
        localStorage.removeItem("email");
        setToken("");
        setUser(null);
        setEmail("");
    }

    return (
        <UserContext.Provider
            value={{loginUser, user, email, token, logout, isLoggedIn, registerUser}}>
            {isReady ? children : null}
        </UserContext.Provider>
    )
};

export const useAuth = () => React.useContext(UserContext);