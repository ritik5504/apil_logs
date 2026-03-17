import api from "./api";
import { getToken } from "../utils/token";

// Use getToken from the token utils file, and use TOKEN_KEY "accessToken"
api.interceptors.request.use((req) => {
    const token = getToken();
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const createProjectApi = async (data) => {
    const res = await api.post("/project/create", data);
    return res.data;
}

export const listOfProjectApi = async () => {
    const res = await api.get("/project/list");
    return res.data;
}

export const projectrotatekey = async () => {
    const res = await api.post("/project/:projectId/rotate-key");
    return res.data;
}
export default api;