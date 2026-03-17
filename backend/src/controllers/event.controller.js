const mongoose = require("mongoose");
const Event = require("../models/Event");
const Project = require("../models/Project");
const { getIO } = require("../realtime/socket.server");
const { emitEventToProject } = require("../realtime/socket.manager");
const Incident = require("../models/Incident");
const metrics = require("../utils/metrics");

const ingestEvent = async (req, res) => {
    try { 
        const { projectId } = req.params;
 
        const project = req.project;
        if (!project || !project._id) {
            return res.status(400).json({ message: "Invalid or missing project." });
        }

        const {
            service,
            severity,
            message,
            metadata,
            environment,
            eventTimestamp
        } = req.body;
 
        if (!service || !severity || !message || !environment) {
            return res.status(400).json({
                message: "Missing required event fields",
            });
        }
 
        let usedEventTimestamp = new Date();
        if (eventTimestamp) {
            const ts = new Date(eventTimestamp);
            if (isNaN(ts.getTime())) {
                return res.status(400).json({ message: "Invalid eventTimestamp" });
            }
            usedEventTimestamp = ts;
        }
 
        const event = await Event.create({
            projectId: project._id,
            service,
            severity,
            message,
            metadata: metadata || {},
            environment,
            eventTimestamp: usedEventTimestamp,
        }); 
        metrics.incrementEvent();
        
        const io = getIO();

        if (["ERROR", "CRITICAL"].includes(severity)) {
            const messageSignature = message.trim().toLowerCase();

            const incident = await Incident.findOneAndUpdate(
                {
                    projectId: project._id,
                    messageSignature,
                    status: { $in: ["OPEN", "ACKNOWLEDGED"] }
                },
                {
                    $set: { lastOccurredAt: usedEventTimestamp },
                    $inc: { eventCount: 1 }
                },
                { new: true }
            );

            if (!incident) {
               incident =  await Incident.create({
                    projectId: project._id,
                    service,
                    severity,
                    messageSignature,
                    firstOccurredAt: usedEventTimestamp,
                    lastOccurredAt: usedEventTimestamp,
                    eventCount: 1
                });
            }
            console.log("realtime:", projectId);
            io.to(`project:${projectId}`).emit(
                "incident-updated",
                incident.toObject ? incident.toObject() : incident
            );
    }

        emitEventToProject(
            io, 
            project._id.toString(), 
            event.toObject ? event.toObject() : event
        )

        return res.status(201).json({
            message: "Event ingested successfully",
            eventId: event._id,
        });

    } catch (error) {
        console.error("Event ingestion error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getProjectEvents = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user && req.user.id;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid projectId format"
            });
        }

        const limit = Math.min(parseInt(req.query.limit) || 50, 200);
        const before = req.query.before;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        if (!project.ownerId || project.ownerId.toString() !== userId?.toString()) {
            return res.status(403).json({
                message: "You are not authorized to view events for this project"
            });
        }

        // Fixing: "Class constructor ObjectId cannot be invoked without 'new'"
        const objectId = new mongoose.Types.ObjectId(projectId);
        const query = { projectId: objectId };
        console.log("projectId", objectId);
        if (before) {
            const beforeDate = new Date(before);
            if (isNaN(beforeDate.getTime())) {
                return res.status(400).json({
                    message: "Invalid 'before' parameter; must be a valid date."
                });
            }
            query.eventTimestamp = { $lt: beforeDate };
        }

        const events = await Event.find(query)
            .sort({ eventTimestamp: -1 })
            .limit(limit)
            .lean();

        return res.status(200).json({
            count: events.length,
            events
        });

    } catch (error) {
        console.error("Get project events error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    ingestEvent,
    getProjectEvents
};