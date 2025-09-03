
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Announcement, AnnouncementIMG } = require("../models/Announcement");
const { name } = require('ejs');
const WeeklyFiles = require("../models/WeeklyFiles");
// --- Login ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Kullanıcı bulunamadı' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Şifre yanlış' });

    const token = jwt.sign({ id: user._id, role: user.role , className: user.className, name: user.name, profileImage: user.profileImage }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true, maxAge: 24*60*60*1000 });

    // Hem görselli hem görselsiz duyuruları çek
 
   res.redirect('/users');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Yeni kullanıcı ekle (default user) ---
exports.addUser = async (req, res) => {
  const { name, email, password, role, className } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Bu email zaten kayıtlı' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      className
    }); 

    await newUser.save();
    res.redirect('/admin'); // Admin paneline yönlendir 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Yetki güncelle ---
exports.setRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    user.role = role;
    await user.save();

    res.json({ message: 'Yetki güncellendi', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};