import {Video} from "~/Models/Video.ts";

import {getAxiosInstance} from "~/axiosInstance.ts";
import {UserProfileToken} from "~/Models/User.ts";


export const fetchVideo = () => {
    const axios = getAxiosInstance()
    console.log("axios" ,axios.defaults.baseURL);
    return axios.get<Video>('/videos/get-next-video');
}

export const saveVideoResponse = (video_id: string, is_real: boolean, reason: string) => {
    const axios = getAxiosInstance()
    return axios.post<UserProfileToken>("/videos/submit-response", {
        video_id: video_id,
        is_real: is_real,
        reason: reason
    });
}