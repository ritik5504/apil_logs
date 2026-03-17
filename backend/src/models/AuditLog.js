const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
    {
        purpose: {
            type: String, 
            required: true, 
            enum: [
                "API_KEY_FAILED", 
                "SOCKET_UNAUTHORIZED", 
                "RATE_LIMIT_EXCEEDED", 
                "KEY_ROTATED"
            ],
            index: true
        }, 
        projectId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: false, 
            index: true,
        },
        ipAddress: {
            type: String, 
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true, 
            maxlength: 500
        }
    }, {
        timestamps: true
    }
)

AuditLogSchema.index({ projectId: 1, createAt: -1 });

module.exports = mongoose.model("Auditlogs", AuditLogSchema);