const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.post('/reset-password', authController.resetPasswordWithToken);

router.get('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;