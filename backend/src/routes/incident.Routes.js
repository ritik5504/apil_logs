const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/incident.controller");
const { authRequired } = require("../middleware/auth");

router.get("/:projectId", authRequired, ctrl.getProjectIncidents);

router.patch("/:incidentId/status", authRequired, ctrl.updateIncidentStatus);

module.exports = router;