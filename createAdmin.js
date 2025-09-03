require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const connectDB = require('./config/db');

const createAdmin = async () => {
  await connectDB();

  const name = 'Müdür';
  const email = 'admin@anaokulu.com';
  const password = '123456'; // istediğin şifreyi buraya yaz
  const role = 'admin';

  // Aynı email var mı kontrol et
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin zaten mevcut');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = new User({
    name,
    email,
    password: hashedPassword,
    role
  });

  await adminUser.save();
  console.log('Admin kullanıcı oluşturuldu:', email);
  process.exit();
};

createAdmin();
