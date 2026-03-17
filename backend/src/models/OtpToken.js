const mongoose = require("mongoose");

const { Schema } = mongoose;

// Clear, consistent, and camel case naming for schema and variables
const OtpTokenSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        purpose: {
            type: String,
            required: true,
            enum: ["login", "verify"],
            index: true
        },
        codeHash: {
            type: String,
            required: true,
            minlength: 60 // Defensive: bcrypt hashes are 60+ chars
        },
        attempts: {
            type: Number,
            default: 0,
            min: 0
        },
        consumed: {
            type: Boolean,
            default: false
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true // Ensure TTL works even if expireAfterSeconds is not applied
        }
    },
    {
        timestamps: true,
        versionKey: false // Optional: avoid __v field clutter for tokens
    } 
);

// TTL index for automatic deletion after expiration
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Useful static method for finding valid OTPs
OtpTokenSchema.statics.findValid = function (userId, purpose) {
    return this.findOne({
        user: userId,
        purpose,
        consumed: false,
        expiresAt: { $gt: new Date() }
    });
};

module.exports = mongoose.model("OtpToken", OtpTokenSchema);