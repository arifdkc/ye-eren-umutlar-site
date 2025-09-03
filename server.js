require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const path = require("path");
const session = require("express-session");

const app = express();

// =================== MongoDB Bağlantısı ===================
connectDB();

// =================== Middlewareler ===================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "gizli",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // production'da true yap
  })
);

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

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/announcements", announcementRoutes);
app.use("/announcementIMG", announcementRoutes);
app.use("/moderator", moderatorRoutes);
app.use("/messages", messageRoutes);
app.use("/payments", paymentRoutes);
app.use("/users", userRoutes);
app.get("/index", (req, res) => {
  res.render("index", { title: "Yeni Umutlar Anaokulu" });
});
app.get("/", (req, res) => {
  res.render("login", { title: "Yeni Umutlar Anaokulu" });
});

// =================== Server ===================
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
