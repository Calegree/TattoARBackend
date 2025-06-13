const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');

router.get('/', reportsController.getAllReports);
router.put('/reject/:id', reportsController.rejectReport);
router.put('/accept/:id', reportsController.acceptReport);



module.exports = router;