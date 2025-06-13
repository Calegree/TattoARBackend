const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logs.controller');
const authenticate  = require("../middlewares/auth.middleware");
const authorizeRole = require("../middlewares/role.middleware");

router.get('/', authenticate, authorizeRole("admin"), logsController.getAllLogs);

module.exports = router;