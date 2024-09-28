import {UserProfileToken} from "~/Models/User.ts";
import {getAxiosInstance} from "~/axiosInstance.ts";

export const loginAPI = (email: string, password: string) => {
    const axios = getAxiosInstance()
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return axios.post<UserProfileToken>("/auth/login", formData);
}

export const registerAPI = (email: string, password: string, age: number, department: string, branch: string) => {
    const axios = getAxiosInstance()
    return axios.post<UserProfileToken>("/auth/signup", {
        email: email,
        password: password,
        age: age,
        department: department,
        branch: branch
    });
}
