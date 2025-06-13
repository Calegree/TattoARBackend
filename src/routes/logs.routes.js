const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logs.controller');

router.get('/', logsController.getAllLogs);

module.exports = router;