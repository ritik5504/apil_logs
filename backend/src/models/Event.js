// Must include:

// projectId (ObjectId reference)

// service

// severity

// message

// timestamp

// createdAt

// Must index:

// projectId

// timestamp

// severity

const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true, 
        index: true,
    },
    service: {
        type: String, 
        required: true, 
        trim: true, 
        maxlength: 100, 
        index: true
    },
    severity: {
        type: String, 
        required: true, 
        enum: ["INFO", "WARN", "ERROR", "CRITICAL"],
        index: true,
    },
    message: {
        type: String, 
        required: true, 
        trim: true, 
        maxlength: 2000,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    environment: {
        type: String, 
        enum: ["development", "staging", "production"],
        default: "production",
        index: true,
    },
    eventTimestamp: {
        type: Date, 
        default: Date.now, 
        index: true,
    },
}, {
    timestamps: true
})

// Compound index for fast project-based queries
EventSchema.index({ projectId: 1, eventTimestamp: -1 });

module.exports = mongoose.model("Event", EventSchema);