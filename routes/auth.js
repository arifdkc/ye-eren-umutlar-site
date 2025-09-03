const express = require('express');
const router = express.Router();
const { login, addUser, setRole, logout } = require('../controllers/authController');
const { authCookieMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Login
router.post('/login', login);

// Yeni kullanıcı ekle (sadece admin)
router.post('/add-user', authCookieMiddleware, adminMiddleware, addUser);

// Yetki güncelle (sadece admin)
router.post('/set-role', authCookieMiddleware, adminMiddleware, setRole);

router.post('/logout', logout);
module.exports = router;
