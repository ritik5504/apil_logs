const mongoose = require("mongoose");
const Incident = require("../models/Incident");
const Project = require("../models/Project");
const { getIO } = require("../realtime/socket.server");

// Get all incidents for a project (requires owner)
exports.getProjectIncidents = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const incidents = await Incident.find({ projectId })
      .sort({ lastOccurredAt: -1 })
      .lean();

    return res.status(200).json({ incidents });
  } catch (error) {
    console.error("Get incidents error:", error);
    return res.status(500).json({ message: "Failed to fetch incidents" });
  }
};

// Update incident status and broadcast the change
exports.updateIncidentStatus = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(incidentId)) {
      return res.status(400).json({ message: "Invalid incident id" });
    }

    if (!["ACKNOWLEDGED", "RESOLVED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const incident = await Incident.findById(incidentId).populate("projectId");
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    const project = incident.projectId;
    if (!project || !project.ownerId || project.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    incident.status = status;
    await incident.save();

    // For websocket update, return a plain object (lean form)
    const incidentForEmit = incident.toObject ? incident.toObject() : incident;

    // Squash the projectId field to only send { _id: .., service: ..., ... }
    if (incidentForEmit.projectId && incidentForEmit.projectId._id) {
      // OK as is
    } else if (project && project._id) {
      incidentForEmit.projectId = { _id: project._id, service: project.service };
    }

    try {
      const io = getIO();
      io.to(`project:${project._id}`).emit("incident-updated", incidentForEmit);
    } catch (emitError) {
      console.error("Socket emit error:", emitError);
    }

    return res.status(200).json({
      message: "Incident updated successfully",
      incident: incidentForEmit,
    });
  } catch (error) {
    console.error("Update incident error:", error);
    return res.status(500).json({ message: "Failed to update incident" });
  }
};