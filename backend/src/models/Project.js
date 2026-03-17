const mongoose = require("mongoose");
const crypto = require("crypto");

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
        default: "",
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    ingestKeyHash: {
        type: String,
        required: true,
        select: false,
    }
}, {
    timestamps: true,
});


ProjectSchema.methods.generateIngestKey = function () {
    const rawKey = crypto.randomBytes(32).toString("hex");
    const hash = crypto
        .createHash("sha256")
        .update(rawKey)
        .digest("hex");
    this.ingestKeyHash = hash; 
    return rawKey;
};

ProjectSchema.methods.verifyIngestKey = function (providedKey) {
    const hash = crypto
        .createHash("sha256") 
        .update(providedKey)
        .digest("hex");
    return this.ingestKeyHash === hash;
};

module.exports = mongoose.model("Project", ProjectSchema);