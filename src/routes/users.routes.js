const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/auth.middleware");



// @route   GET /api/v1/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authMiddleware, usersController.getMe);

// @route   GET /api/v1/users/:userId
// @desc    Get public profile by user ID
// @access  Public
router.get('/:userId', usersController.getUserById);

// @route   PUT /api/v1/users/me
// @desc    Update current user profile
// @access  Private
router.put('/me', authMiddleware, usersController.updateMe);

// @route   DELETE /api/v1/users/me
// @desc    Delete current user account
// @access  Private
router.delete('/me', authMiddleware, usersController.deleteMe);

module.exports = router;
