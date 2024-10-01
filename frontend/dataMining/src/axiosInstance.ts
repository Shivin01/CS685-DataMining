import axios, {AxiosError, AxiosInstance} from "axios";
// import axios, {AxiosInstance} from "axios";

export const getAxiosInstance = () => {
    const axiosInstance: AxiosInstance = axios.create();
    const token = localStorage.getItem("token");
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
    axiosInstance.defaults.baseURL = import.meta.env.PROD ? "https://<change_this>" : "http://127.0.0.1:8000"

    axiosInstance.interceptors.response.use(
        (response) => response,
        globalErrorHandler,
    );


    function globalErrorHandler(err: AxiosError) {
        if (err?.response?.status === 401) {
            // window.location.href = import.meta.env.PROD ? window.location.host + '/signin' : window.location.host + '/signin'
            window.location.href = import.meta.env.PROD ? window.location.host + '/signin' : window.location.host + '/signin'
        }
        return Promise.reject(err);
    }

    return axiosInstance
}