const jwt = require('jsonwebtoken');

// Cookie tabanlı auth
exports.authCookieMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Token gerekli' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // artık className burada var
    next();
  } catch {
    res.status(401).json({ message: 'Geçersiz token' });
  }
};
exports.addAnnouncementMiddleware = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Token gerekli' });
  if (req.user.role !== 'moderator' && req.user.role !== 'admin') return res.status(403).json({ message: 'Yetkisiz erişim' });
  next();
};

exports.moderatorMiddleware = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Token gerekli' });
  if (req.user.role !== 'moderator' && req.user.role !== 'admin') return res.status(403).json({ message: 'Yetkisiz erişim' });
  next();
};

// Admin yetki kontrolü
exports.adminMiddleware = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Token gerekli' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Yetkisiz erişim' });
  next();
};
exports.authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Token gerekli" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Geçersiz token" });
  }
};
