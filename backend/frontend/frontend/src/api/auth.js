import axios from "axios";
const API_URL = "http://127.0.0.1:8000/store/api/";


// Login and store JWT 
export const loginUser = async (username, password)=>{
    const response = await axios.post(`${API_URL}token/`,{
        username,
        password,
    });

    if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${response.data.access}`;
    }

    return response.data;
};
// Refresh Token (which is an optional Utility)
export const refreshToken = async () =>{
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) return;

    const response = await axios.post(`${API_URL}/token/refresh/`,{
        refresh: refresh,
    });

    localStorage.setItem("access_token", response.data.access);
    axios.defaults.headers.common[
        "Authorization"
    ] = `Bearer ${response.data.access}`;

    return response.data
};
