const express = require("express");
const router = express.Router();

const {validateEvent} = require("../validations/Event.validation");
const ctrl = require("../controllers/event.controller");
const {authRequired} = require("../middleware/auth");
const { apiKeyAuth } = require("../middleware/apiKeyAuth");
const { projectRateLimiter } = require("../middleware/projectRateLimiter");

router.post("/ingest/:projectId", apiKeyAuth, projectRateLimiter, validateEvent,  ctrl.ingestEvent );
router.get("/:projectId", authRequired, ctrl.getProjectEvents);

module.exports = router;