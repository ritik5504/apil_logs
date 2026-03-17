const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { CLIENT_PRO_URL } = require("./example.env");

// const { globalLimiter } = require("./src/middleware/ratelimiter");
const { performanceTimer } = require("./src/middleware/performanceTimer");

const authRoutes = require("./src/routes/auth.Routes");
const projectRoutes = require("./src/routes/project.Routes");
const eventRoutes = require("./src/routes/event.Routes");
const IncidentRoutes = require("./src/routes/incident.Routes");
const systemRoutes = require("./src/routes/system.routes");
const app = express();


// CORS
app.use(cors({
    origin: CLIENT_PRO_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use(performanceTimer);
// app.use(globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/incidents", IncidentRoutes)
app.use("/api/system", systemRoutes);
module.exports = app;