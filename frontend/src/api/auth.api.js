import api from "./api"
// Register
export const registerUser = async (data) => {
    const res = await api.post("/auth/register", data);
    console.log(res.data);
    return res.data;
}
// Email VERIFY
export const verifyEmailOtp = async (data) => {
    const res = await api.post("/auth/verify/confirm", data);
    return res.data;
};

// Login
export const loginUser = async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
}

// Login OTP

export const requestLoginOtp = async (data) => {
    const res = await api.post("/auth/login/otp/request", data);
    return res.data;
}

export const verifyLoginOtp = async (data) => {
    const res = await api.post("/auth/login/otp/verify", data);
    return res.data;
};


// Token
export const refreshToken = async () => {
    const res = await api.post("/auth/token/refresh");
    return res.data;
};

// LOGOUT
export const logoutEverywhere = async (token) => {
    const res = await api.post(
        "/auth/logout-everywhere",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
}

//Resend OTP 
export const resendVerifyOtp = async (data) => {
    const res = await api.post("/auth/verify/resend", data);
    return res.data;
}


export default api;