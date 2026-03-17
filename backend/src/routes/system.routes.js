const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/system.controller");

router.get("/health", ctrl.getHealth);
router.get("/metrics", ctrl.getMetrics);

module.exports = router;