require("dotenv").config();

// --- Begin: Fixed required keys and parsing for .env (lines 1-18) ---

const REQUIRED_VARS = [
    "PORT",
    "MONGO_URI",
    "SaltValue",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_ACCESS_EXPIRES_IN",
    "JWT_REFRESH_EXPIRES_IN",
    "OTP_LENGTH",
    "OTP_TTL_SECONDS",
    "OTP_MAX_ATTEMPTS",
    "SMTP_FROM",
    "SENDGRID_API_KEY",
    "RATE_LIMIT_WINDOW_MS",
    "RATE_LIMIT_MAX",
    "NODE_ENV",
    "CLIENT_URL"
];

// Custom parse function for ms/minutes
function parseMs(val) {
    if (!val) return undefined;
    if (/^\d+$/.test(val)) return parseInt(val, 10);
    const m = /^(\d+)\s*m$/i.exec(val);
    if (m) return parseInt(m[1], 10) * 60 * 1000;
    return undefined;
}

function getEnv(key, fallback = undefined) {
    if (typeof fallback !== "undefined") {
        return process.env[key] || fallback;
    }
    return process.env[key];
}

// Enforce checks for required variables in production
if (process.env.NODE_ENV === "production") {
    for (const key of REQUIRED_VARS) {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }
}

const config = {
    GLOBAL_RATE_LIMIT_WINDOW_MS: getEnv("GLOBAL_RATE_LIMIT_WINDOW_MS") ? parseMs(getEnv("GLOBAL_RATE_LIMIT_WINDOW_MS")) : undefined,
    PORT: getEnv("PORT", 3000),
    MONGO_URI: getEnv("MONGO_URI"),
    SALT: parseInt(getEnv("SaltValue", 10), 10) || 10,
    JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
    JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
    JWT_ACCESS_EXPIRES_IN: getEnv("JWT_ACCESS_EXPIRES_IN", "15m"),
    JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d"),
    OTP_LENGTH: parseInt(getEnv("OTP_LENGTH", 6), 10),
    OTP_TTL_SECONDS: parseInt(getEnv("OTP_TTL_SECONDS", 600), 10),
    OTP_MAX_ATTEMPTS: parseInt(getEnv("OTP_MAX_ATTEMPTS", 5), 10),
    SMTP_FROM: getEnv("SMTP_FROM"),
    SENDGRID_API_KEY: getEnv("SENDGRID_API_KEY"),
    RATE_LIMIT_WINDOW_MS: getEnv("RATE_LIMIT_WINDOW_MS") ? parseMs(getEnv("RATE_LIMIT_WINDOW_MS")) : undefined,
    RATE_LIMIT_MAX: getEnv("RATE_LIMIT_MAX") ? parseInt(getEnv("RATE_LIMIT_MAX"), 10) : undefined,
    NODE_ENV: getEnv("NODE_ENV"),
    CLIENT_URL: getEnv("CLIENT_URL"),
    CLIENT_PRO_URL: getEnv("CLIENT_PRO_URL", undefined),
};

module.exports = config;