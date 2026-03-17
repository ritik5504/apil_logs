const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth.Controller");
const { authRequired } = require("../middleware/auth");
const { otpLimiter } = require("../middleware/ratelimiter");
// Import Joi-based validators from Validation middleware
const { validateRegister, validateLogin } = require("../validations/auth.Validation");

// REGISTER: Create account
router.post(
  "/register",
  validateRegister,
  ctrl.register
);

// RESEND VERIFICATION OTP
router.post(
  "/verify/resend",
  otpLimiter,
  ctrl.resendVerificationOtp
);

// EMAIL VERIFICATION OTP SUBMIT
router.post(
  "/verify/confirm",
  otpLimiter,
  ctrl.verifyEmail
);

// LOGIN WITH PASSWORD
router.post(
  "/login",
  validateLogin,
  ctrl.loginWithPassword
);

// REQUEST OTP FOR EMAIL LOGIN OR STEP-UP
router.post(
  "/login/otp/request",
  otpLimiter,
  ctrl.requestLoginOtp
);

// VERIFY LOGIN OTP
router.post(
  "/login/otp/verify",
  otpLimiter,
  ctrl.verifyLoginOtp
);

// REFRESH TOKEN
router.post(
  "/token/refresh",
  ctrl.refreshToken
);

// LOGOUT FROM ALL SESSIONS (PROTECTED)
router.post(
  "/logout-everywhere",
  authRequired,
  ctrl.logoutEverywhere
);

// 404 handler for undefined routes under /auth
// router.all("*", (req, res) => res.status(404).json({ error: "Not found" }));

module.exports = router;