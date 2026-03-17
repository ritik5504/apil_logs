const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Project", 
            required: true, 
            index: true
        }, 
        service: {
            type: String, 
            required: true, 
            index: true
        }, 
        severity: {
            type: String, 
            enum: ["INFO", "WARN", "ERROR", "CRITICAL"],
            required: true, 
            index: true
        },
        messageSignature: {
            type: String, 
            required: true, 
            index: true
        }, 
        status: {
            type: String, 
            enum: ["OPEN", "ACKNOWLEDGED", "RESOLVED"],
            default: "OPEN", 
            index: true
        },
        firstOccurredAt: {
            type: Date, 
            required: true
        },
        lastOccurredAt: {
            type: Date, 
            required: true
        },
        eventCount: { // Fixed typo: "evenCount" -> "eventCount"
            type: Number,
            default: 1
        }
    }, 
    {
        timestamps: true
    }
);

// Index for fast lookups on frequently queried fields
IncidentSchema.index({
    projectId: 1,
    messageSignature: 1,
    status: 1
});

module.exports = mongoose.model("Incident", IncidentSchema);