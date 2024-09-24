import {UserProfileToken} from "~/Models/User.ts";
import {getAxiosInstance} from "~/axiosInstance.ts";

export const loginAPI = (email: string, password: string) => {
    const axios = getAxiosInstance()
    return axios.post<UserProfileToken>("/concept/login_user/", {
        email: email,
        password: password
    });
}

export const registerAPI = (email: string, password: string) => {
    const axios = getAxiosInstance()
    return axios.post<UserProfileToken>("/user/sign_up", {
        email: email,
        password: password
    });
}
