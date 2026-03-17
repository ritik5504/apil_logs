const mongoose = require("mongoose");
const Project = require("../models/Project");
const metrics = require("../utils/metrics");

/**
 * Registers all socket event handlers on new connection.
 * Handles incrementing/decrementing metrics for active connections.
 */
async function registerSocketHandlers(io, socket) {
    // Connection handler: increment socket connection metric
    metrics.incrementSocketConnections();

    socket.on("subscribe", async ({ projectId }) => {
        try {
            if (!projectId) {
                return socket.emit("subscription-error", "Project ID is required");
            }

            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return socket.emit("subscription-error", "Invalid project Id format");
            }

            const project = await Project.findById(projectId).select("ownerId");

            if (!project) {
                return socket.emit("subscription-error", "Project not found");
            }

            if (project.ownerId.toString() !== socket.userId.toString()) {
                try {
                    await AuditLog.create({
                        purpose: "SOCKET_UNAUTHORIZED",
                        projectId,
                        userId: socket.userId,
                        message: "Unauthorized socket subscription attempt"
                    });
                } catch (e) {
                    console.error("Audit log error:", e);
                }
                return socket.emit("subscription-error", "Unauthorized access to this project");
            }

            const roomName = `project:${projectId}`;

            socket.join(roomName);

            socket.emit("subscription-success", {
                projectId,
                message: "Subscribed successfully"
            });

            console.log(`User ${socket.userId} joined ${roomName}`);
        } catch (error) {
            if (typeof metrics.incrementSubscriptionError === "function") {
                metrics.incrementSubscriptionError();
            }
            console.error("Subscription error:", error);
            socket.emit("subscription-error", "Subscription failed");
        }
    });

    socket.on("unsubscribe", ({ projectId }) => {
        if (!projectId) return;

        const roomName = `project:${projectId}`;
        socket.leave(roomName);

        console.log(`User ${socket.userId} left ${roomName}`);
    });

    // Disconnect handler: decrement socket connection metric
    socket.on("disconnect", () => {
        metrics.decrementSocketConnections();
    });
}

function emitEventToProject(io, projectId, eventData) {
    const roomName = `project:${projectId}`;
    io.to(roomName).emit("new-event", eventData);
}

module.exports = {
    registerSocketHandlers,
    emitEventToProject
};