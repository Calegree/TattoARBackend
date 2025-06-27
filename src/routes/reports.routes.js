const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const authenticate  = require("../middlewares/auth.middleware");
const authorizeRole = require("../middlewares/role.middleware");


router.get('/', /*authenticate, authorizeRole("admin"),*/ reportsController.getAllReports);
router.put('/updateReport/:id',/*authenticate, authorizeRole("admin"),*/ reportsController.updateReportState);
module.exports = router;