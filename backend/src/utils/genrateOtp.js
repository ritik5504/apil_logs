const bcrypt = require("bcrypt");
const crypto = require("crypto");
const env = require("../../example.env");

function randomDigits(length) {
    length = Number(length);
    if (!Number.isInteger(length) || length < 1 || length > 12) {
        throw new Error("OTP length must be an integer between 1 and 12");
    }
    let result = "";
    while (result.length < length) {
        const buf = crypto.randomBytes(length);
        for (const byte of buf) {
            if (result.length >= length) break;
            if (byte < 250) result += String(byte % 10);
        }
    }
    return result.padStart(length, "0");
}

async function makeOtp() {
    const otpLen = Number(env.OTP_LENGTH) || 6;
    const plain = randomDigits(otpLen);
    const saltRounds = Number(env.SALT) || 10;
    const hash = await bcrypt.hash(plain, saltRounds);
    const ttlSeconds = Number(env.OTP_TTL_SECONDS) || 300;
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    return { plain, hash, expiresAt };
}

module.exports = { makeOtp };