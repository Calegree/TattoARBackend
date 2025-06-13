const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const authenticate  = require("../middlewares/auth.middleware");
const authorizeRole = require("../middlewares/role.middleware");


router.get('/', authenticate, authorizeRole("admin"), reportsController.getAllReports);
router.put('/reject/:id', authenticate, authorizeRole("admin"), reportsController.rejectReport);
router.put('/accept/:id', authenticate, authorizeRole("admin"), reportsController.acceptReport);

module.exports = router;