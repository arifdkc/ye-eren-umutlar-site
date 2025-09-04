const express = require('express');
const router = express.Router();
const { login, addUser, setRole, logout } = require('../controllers/authController');
const { authCookieMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { get } = require('mongoose');

// Login
router.post('/login', login);
router.post('/add-user', authCookieMiddleware, adminMiddleware, addUser);

// Yetki güncelle (sadece admin)
router.post('/set-role', authCookieMiddleware, adminMiddleware, setRole);

router.post('/logout', logout);
module.exports = router;
