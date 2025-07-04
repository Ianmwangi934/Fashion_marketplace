import axios from "axios";

const API_URL = "https://fashion-marketplace-12.onrender.com/store";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    response => response,
    async error =>{
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            localStorage.getItem("refresh_token")
        ) {
            originalRequest._retry = true;
            try {
                const response = await axios.post(`${API_URL}/api/token/refresh/`,{
                    refresh: localStorage.getItem("refresh_token"),
                });

                const newAccessToken = response.data.access;
                localStorage.setItem("access_token", newAccessToken);
                axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Aurthorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error("Token refresh failed:", error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
