const jwt = require("jsonwebtoken");
const env = require("../../example.env");

/**
 * Middleware to verify JWT access token.
 * Expects header: Authorization: Bearer <token>
 */
function authRequired(req, res, next) {
    try {
        const header = req.headers?.authorization || "";
        if (!header.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authorization header must be provided in the format: Bearer <token>" });
        }

        const token = header.slice(7).trim();
        if (!token) {
            return res.status(401).json({ error: "Missing token" });
        }

        if (!env.JWT_ACCESS_SECRET) {
            // Defensive: JWT secret must be defined
            return res.status(500).json({ error: "Server misconfiguration: JWT secret missing." });
        }

        let payload;
        try {
            payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
        } catch (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Defensive: Check required payload fields
        if (!payload || typeof payload.sub === "undefined" || typeof payload.tv === "undefined") {
            return res.status(401).json({ error: "Malformed token payload" });
        }

        req.user = {
            id: payload.sub,
            tokenVersion: payload.tv
        };
        next();
    } catch (err) {
        // General unexpected error
        return res.status(500).json({ error: "Authentication middleware error" });
    }
}

module.exports = { authRequired };