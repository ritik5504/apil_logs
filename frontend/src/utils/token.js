const TOKEN_KEY = "token";

export const setToken = (token) => {
    if(!token) return;
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const isLoggedIn = () => {
    return !!getToken();
}