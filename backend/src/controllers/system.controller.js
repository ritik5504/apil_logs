const os = require("os");
const mongoose = require("mongoose");
const metrics = require("../utils/metrics");

function formatMemoryUsage(memObj) {
    return {
        rss: (memObj.rss / 1024 / 1024).toFixed(2) + " MB",
        heapTotal: (memObj.heapTotal / 1024 / 1024).toFixed(2) + " MB",
        heapUsed: (memObj.heapUsed / 1024 / 1024).toFixed(2) + " MB",
        external: (memObj.external / 1024 / 1024).toFixed(2) + " MB",
        arrayBuffers: (memObj.arrayBuffers / 1024 / 1024).toFixed(2) + " MB"
    };
}

exports.getHealth = async (req, res) => {
    try {
        const healthData = {
            status: "OK",
            uptimeSeconds: process.uptime(),
            memory: formatMemoryUsage(process.memoryUsage()),
            cpuLoad: {
                "1min": os.loadavg()[0],
                "5min": os.loadavg()[1],
                "15min": os.loadavg()[2]
            },
            platform: os.platform(),
            arch: os.arch(),
            cpuCores: os.cpus().length,
            nodeVersion: process.version,
            mongo: {
                connectionState: mongoose.connection.readyState,
                host: mongoose.connection.host,
                name: mongoose.connection.name
            },
            activeSocketConnections: typeof metrics.getActiveSocketConnections === "function"
                ? metrics.getActiveSocketConnections()
                : (metrics.activeSocketConnections ?? null),
            timestamp: new Date().toISOString()
        };
        res.status(200).json(healthData);
    } catch (error) {
        console.error("Health check failed:", error);
        res.status(500).json({
            message: "Health check failed",
            error: error?.message || "Unknown error"
        });
    }
};

exports.getMetrics = async (req, res) => {
    try {
        if (!metrics || typeof metrics.getSnapshot !== "function") {
            throw new Error("Metrics module or getSnapshot method missing");
        }
        const snapshot = metrics.getSnapshot();
        res.status(200).json(snapshot);
    } catch (error) {
        console.error("Metrics retrieval failed:", error);
        res.status(500).json({
            message: "Metrics retrieval failed",
            error: error?.message || "Unknown error"
        });
    }
};