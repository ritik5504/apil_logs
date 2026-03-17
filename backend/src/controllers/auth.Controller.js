const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const OtpToken = require("../models/OtpToken");
const { makeOtp } = require("../utils/genrateOtp");
const { sendOtpEmail } = require("../utils/sendEmail");
const env = require("../../example.env");

function signToken(user) {
    const payload = { sub: user.id, tv: user.tokenVersion };
    return {
        accessToken: jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN }),
        refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN })
    };
}

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const user = new User({ username, email, password });
    await user.save();

    const { plain, hash, expiresAt } = await makeOtp();
    await OtpToken.create({ user: user._id, purpose: "verify", codeHash: hash, expiresAt });

    await sendOtpEmail(user.email, plain, "verify");
    return res.status(201).json({ message: "Registered. Verification OTP sent to email." });
};

exports.resendVerificationOtp = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isVerified) return res.status(400).json({ error: "Already verified" });

    await OtpToken.updateMany({ user: user._id, purpose: "verify", consumed: false }, { consumed: true });
    const { plain, hash, expiresAt } = await makeOtp();
    await OtpToken.create({ user: user._id, purpose: "verify", codeHash: hash, expiresAt });

    await sendOtpEmail(user.email, plain, "verify");
    return res.json({ message: "Verification OTP resent." });
};

exports.verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = await OtpToken.findOne({ user: user._id, purpose: "verify", consumed: false }).sort({ createdAt: -1 });
    if (!token || token.expiresAt < new Date()) return res.status(400).json({ error: "OTP expired or not found" });
    if (token.attempts >= env.OTP_MAX_ATTEMPTS) return res.status(429).json({ error: "Max attempts exceeded" });

    const ok = await bcrypt.compare(otp, token.codeHash);
    if (!ok) {
        token.attempts += 1;
        await token.save();
        return res.status(400).json({ error: "Invalid OTP" });
    }
    token.consumed = true;
    await token.save();

    user.isVerified = true;
    await user.save();

    const { accessToken, refreshToken } = signToken(user);
    return res.json({ message: "Email verified", accessToken, refreshToken });
};

exports.loginWithPassword = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    if (!user.isVerified) return res.status(403).json({ error: "Email not verified" });

    const { accessToken, refreshToken } = signToken(user);
    return res.json({ accessToken, refreshToken });
};

exports.requestLoginOtp = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.isVerified) return res.status(403).json({ error: "Email not verified" });

    await OtpToken.updateMany({ user: user._id, purpose: "login", consumed: false }, { consumed: true });
    const { plain, hash, expiresAt } = await makeOtp();
    await OtpToken.create({ user: user._id, purpose: "login", codeHash: hash, expiresAt });
    await sendOtpEmail(user.email, plain, "login");
    return res.json({ message: "Login OTP sent." });
};

exports.verifyLoginOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = await OtpToken.findOne({ user: user._id, purpose: "login", consumed: false }).sort({ createdAt: -1 });
    if (!token || token.expiresAt < new Date()) return res.status(400).json({ error: "OTP expired or not found" });
    if (token.attempts >= env.OTP_MAX_ATTEMPTS) return res.status(429).json({ error: "Max attempts exceeded" });

    const ok = await bcrypt.compare(otp, token.codeHash);
    if (!ok) {
        token.attempts += 1;
        await token.save();
        return res.status(400).json({ error: "Invalid OTP" });
    }
    token.consumed = true;
    await token.save();

    const { accessToken, refreshToken } = signToken(user);
    return res.json({ accessToken, refreshToken });
};

exports.refreshToken = async (req, res) => {
    // Support token in body { token }, or fallback to Authorization: Bearer <token>
    const authHeader = req.headers && req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const token = (req.body && req.body.token) || bearerToken;

    if (!token) return res.status(400).json({ error: "Missing token" });

    try {
        const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.sub);
        if (!user || user.tokenVersion !== payload.tv) throw new Error("Invalid token");
        const { accessToken, refreshToken } = signToken(user);
        return res.json({ accessToken, refreshToken });
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
};

exports.logoutEverywhere = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.tokenVersion += 1;
    await user.save();
    return res.json({ message: "Logged out from all sessions" });
};