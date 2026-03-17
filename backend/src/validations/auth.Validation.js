const Joi = require("joi");

// Production-level validation schemas for Registration and Login

const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.base": "Username must be a string",
            "string.empty": "Username is required",
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username must be at most 100 characters",
            "any.required": "Username is required"
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.base": "Email must be a string",
            "string.email": "Please provide a valid email address",
            "string.empty": "Email is required",
            "any.required": "Email is required"
        }),
    password: Joi.string()
        .min(8)
        .max(500)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$"))
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must be at most 50 characters",
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
            "string.empty": "Password is required",
            "any.required": "Password is required"
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.base": "Email must be a string",
            "string.email": "Please provide a valid email address",
            "string.empty": "Email is required",
            "any.required": "Email is required"
        }),
    password: Joi.string()
        .required()
        .messages({
            "string.empty": "Password is required",
            "any.required": "Password is required"
        })
});


// Middleware validators
const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(e => e.message) });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(e => e.message) });
    }
    next();
};


module.exports = {
    validateRegister,   
    validateLogin,
    registerSchema,
    loginSchema
};