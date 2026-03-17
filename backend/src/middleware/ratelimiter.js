const rateLimit = require("express-rate-limit");
const env = require("../../example.env");

const globalLimiter = rateLimit({
    windowMs: env.GLOBAL_RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    message: { error: "Too many requests from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Consistent naming, error responses, and fallback for OTP limiter as well
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: { error: "Too many OTP requests from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { globalLimiter, otpLimiter };