const express = require('express');
const router = express.Router();
const { validateUserRegistration, validateUserLogin, handleValidationErrors } = require('../middleware/validations');
const { register, login, logout } = require('../controllers/authController');

const { getUserById } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/users/:id', authMiddleware, getUserById);
// Registration route with validation middleware
router.post('/register', validateUserRegistration, handleValidationErrors, register);

// Login route with validation middleware
router.post('/login', validateUserLogin, handleValidationErrors, login);
router.post('/logout', authMiddleware, logout); // Protect this route with the same middleware

module.exports = router;
