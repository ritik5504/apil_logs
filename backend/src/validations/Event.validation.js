const Joi = require("joi");

const SEVERITY_LEVELS = ["INFO", "WARN", "ERROR", "CRITICAL"];

const eventBodySchema = Joi.object({
    service: Joi.string()
        .trim()
        .required()
        .min(2)
        .max(100)
        .messages({
            "string.base": "Service must be a string",
            "string.empty": "Service must not be empty",
            "string.min": "Service must be at least 2 characters",
            "string.max": "Service must be at most 100 characters",
            "any.required": "Service is required",
        }),
    severity: Joi.string()
        .valid(...SEVERITY_LEVELS)
        .required()
        .messages({
            "string.base": "Severity must be a string",
            "any.only": "Severity must be one of INFO, WARN, ERROR, CRITICAL",
            "any.required": "Severity is required",
        }),
    message: Joi.string()
        .trim()
        .required()
        .min(1)
        .max(2000)
        .messages({
            "string.base": "Message must be a string",
            "string.empty": "Message is required",
            "string.min": "Message cannot be empty",
            "string.max": "Message must be at most 2000 characters",
            "any.required": "Message is required",
        }),
    metadata: Joi.object()
        .optional()
        .unknown(true)
        .messages({
            "object.base": "Metadata must be a valid JSON object",
        }),
    environment: Joi.string()
        .valid("development", "staging", "production")
        .optional()
        .messages({
            "any.only": "Environment must be development, staging, or production",
            "string.base": "Environment must be a string",
        }),
    eventTimestamp: Joi.date()
        .optional()
        .messages({
            "date.base": "eventTimestamp must be a valid date",
        }),
});

const eventParamsSchema = Joi.object({
    projectId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.base": "Project ID must be a string",
            "string.hex": "Project ID must be a valid ObjectId",
            "string.length": "Project ID must be a valid ObjectId",
            "any.required": "Project ID is required",
        }),
});

// middleware
const validateEvent = (req, res, next) => {
    const { error: paramsError } = eventParamsSchema.validate(req.params, { abortEarly: false });
    if (paramsError) {
        return res.status(400).json({
            errors: paramsError.details.map((e) => e.message),
        });
    }

    const { error: bodyError } = eventBodySchema.validate(req.body, { abortEarly: false });
    if (bodyError) {
        return res.status(400).json({
            errors: bodyError.details.map((e) => e.message),
        });
    }

    next();
};

module.exports = {
    validateEvent,
    eventBodySchema,
    eventParamsSchema,
};