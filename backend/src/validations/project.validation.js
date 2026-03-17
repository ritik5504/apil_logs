const Joi = require("joi");

// Validation schema corresponding to the Project mongoose model
const ProjectSchema = Joi.object({
    projectName: Joi.string()
        .trim()
        .required()
        .min(3)
        .max(200)
        .messages({
            "string.base": "Project name must be a string",
            "string.empty": "Project name is required",
            "string.min": "Project name must be at least 3 characters",
            "string.max": "Project name must be at most 200 characters",
            "any.required": "Project name is required"
        }),
    description: Joi.string()
        .allow("")
        .trim()
        .max(500)
        .messages({
            "string.base": "Description must be a string",
            "string.max": "Description must be at most 500 characters",
        }), 
});

const ValidateProject = (req, res, next) => {
    const { error } = ProjectSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ errors: error.details.map(e => e.message) });
    }
    next();
};

module.exports = {
    ProjectSchema,
    ValidateProject
};