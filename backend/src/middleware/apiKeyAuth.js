const mongoose = require("mongoose");
const Project = require("../models/Project");
const AuditLog = require("../models/AuditLog");
const metrics = require("../utils/metrics");

const apiKeyAuth = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const providedKey = req.headers["x-api-key"];

        if (!providedKey) {
            return res.status(401).json({
                message: "API key missing"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid projectId format"
            });
        }

        const project = await Project.findById(projectId).select("+ingestKeyHash");
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // FIX: Should call verifyIngestKey on the project, not projectId
        const isValid = project.verifyIngestKey(providedKey);

        if (!isValid) {
            try{
                await AuditLog.create({
                    purpose: "API_KEY_FAILED", 
                    projectId, 
                    ipAddress: req.ip, 
                    message: "Invalid API key attempt"
                });
            }catch (error) {
                console.error("audit log error: ", error);
            }
            return res.status(403).json({ message: "Invalid API key"});
        }

        req.project = project;
        next();
    } catch (error) {
        metrics.incrementApiKeyFailure();
        return res.status(500).json({
            message: "API Key authentication failed",
            error: error.message
        });
    }
};

module.exports = { apiKeyAuth };