const Project = require("../models/Project");
const Audit = require("../models/AuditLog");
exports.createProject = async (req, res) => {
    try {
        const { projectName, description } = req.body;
        const ownerId = req.user.id;

        const existsProject = await Project.findOne({
            projectName,
            ownerId,
        });

        if (existsProject) {
            return res.status(409).json({
                message: "Project with this name already exists"
            });
        }

        // Create new, UNSAVED project document
        const project = new Project({
            projectName,
            description,
            ownerId,
        });

        // Generate apiKey and set the ingestKeyHash before save
        const apiKey = project.generateIngestKey();

        // Now save after required field is set
        await project.save();

        return res.status(200).json({
            message: "Project Created Successfully",
            project: {
                _id: project._id,
                projectName: project.projectName, // Fixed typo
                description: project.description,
                createdAt: project.createdAt,
            },
            ingestKey: apiKey,
            note: "Store this Api key securely. It will not be shown again."
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create Project",
            error: error.message
        });
    }
};

exports.listProject = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const Projects = await Project.find({ ownerId }).sort({ createdAt: -1 });
        return res.status(200).json({
            Projects,
        });
    } catch (error) {
        res.status(500).json({
            message: "failed to fetch Project",
            error: error.message
        });
    }
};

exports.rotateIngestKey = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        if (!projectId) {
            return res.status(400).json({
                message: "Project ID is required"
            });
        }

        // Only select ingestKeyHash if needed; also fetch ownerId for validation
        const project = await Project.findById(projectId).select("+ingestKeyHash ownerId");

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (String(project.ownerId) !== String(userId)) {
            return res.status(403).json({
                message: "Unauthorized: You do not own this project"
            });
        }

        // Rotate (regenerate) the API key and update the hash on the document
        const newApiKey = project.generateIngestKey();

        await project.save();

        try {
            await AuditLog.create({
                purpose: "KEY_ROTATED", 
                projectId, 
                userId, 
                message: "API key rotated successfully"
            });
        }catch (e) {
            console.error("Audit log error:", e);
        }

        return res.status(200).json({
            message: "API key rotated successfully",
            ingestKey: newApiKey,
            note: "Store this API key securely. It will not be shown again."
        });
    } catch (error) {
        console.error("API key rotation error:", error);
        return res.status(500).json({
            message: "Failed to rotate API key",
            error: error.message,
        });
    }
};