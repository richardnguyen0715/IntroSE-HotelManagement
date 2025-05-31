// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, logout, verifyRegistrationOTP } = require('../controllers/authenticator');

// define endpoints
router.post('/register', register);
router.post('/verify-registration-otp', verifyRegistrationOTP);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
