require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const path = require("path");
const session = require("express-session");
const WeeklyFiles = require("./models/WeeklyFiles");
const app = express();

// =================== MongoDB Bağlantısı ===================
connectDB();

// =================== Middlewareler ===================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const MongoStore = require("connect-mongo");

app.use(session({
  secret: process.env.SESSION_SECRET || "gizli_kelime",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Senin MongoDB Atlas bağlantın
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 gün
  }
}));

// app.js veya server.js içinde, route'lardan önce
app.use(async (req, res, next) => {
  const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
  res.locals.weeklyFiles = weeklyFiles; // Tüm view'larda erişilebilir olacak
  res.locals.user = req.session.user || null; // Tüm view'larda user bilgisine erişilebilir olacak
  next();
});


// =================== View Engine ===================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // statik görseller

// =================== Routes ===================
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const announcementRoutes = require("./routes/announcementRoutes");
const moderatorRoutes = require("./routes/moderatorRoutes");
const messageRoutes = require("./routes/messageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const pageRoutes = require("./routes/pageRoutes");

app.use("/", pageRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/announcements", announcementRoutes);
app.use("/announcementIMG", announcementRoutes);
app.use("/moderator", moderatorRoutes);
app.use("/messages", messageRoutes);
app.use("/payments", paymentRoutes);
app.use("/users", userRoutes);


// =================== Server ===================
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
