const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/project.Controller");
const { authRequired } = require ("../middleware/auth");

const { ValidateProject } = require("../validations/project.validation");

router.post("/create", authRequired, ValidateProject, ctrl.createProject);
router.get("/list", authRequired, ValidateProject, ctrl.listProject);
router.post("/:projectId/rotate-key", authRequired, ctrl.rotateIngestKey);

module.exports = router;