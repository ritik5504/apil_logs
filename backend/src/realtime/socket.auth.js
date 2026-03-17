const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET } = process.env;

async function verifySocketToken(token) {
    console.log("function called");
    try {
        if (!JWT_ACCESS_SECRET) {
            throw new Error("JWT secret is not defined");
        }

        if (!token) {
            throw new Error("No token provided");
        }
        console.log(token, JWT_ACCESS_SECRET)
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        console.log("decoded", decoded);

        if (!decoded || !decoded.sub) {
            throw new Error("Invalid token payload");
        }

        return decoded;
    } catch (error) {
        throw new Error("Unauthorized socket connection");
    }
}

module.exports = {
    verifySocketToken
};