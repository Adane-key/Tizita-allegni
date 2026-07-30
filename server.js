require("dotenv").config();
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const bcrypt = require("bcryptjs");

const db = require("./lib/db");
const { i18nMiddleware } = require("./lib/i18n");
const { loadUser } = require("./lib/auth");

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- One-time setup: ensure a default admin account exists ----------
function ensureDefaultAdmin() {
  const users = db.getUsers();
  const hasAdmin = users.some((u) => u.role === "admin");
  if (!hasAdmin) {
    const passwordHash = bcrypt.hashSync("admin123", 10);
    db.addUser({
      fullName: "Nathy Admin",
      email: "admin@nathycar.com",
      phone: "+251900000000",
      passwordHash,
      role: "admin",
    });
    console.log("----------------------------------------------------");
    console.log("Default admin account created:");
    console.log("  email:    admin@nathycar.com");
    console.log("  password: admin123");
    console.log("Please log in and change this password setup ASAP.");
    console.log("----------------------------------------------------");
  }
}
ensureDefaultAdmin();

// ---------- View engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- Middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "nathy-car-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
  })
);

app.use(i18nMiddleware);
app.use(loadUser);

// ---------- Routes ----------
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/cars", carRoutes);
app.use("/", bookingRoutes);
app.use("/admin", adminRoutes);

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).render("error", { message: "Page not found." });
});

app.listen(PORT, () => {
  console.log(`NATHY CAR running on port ${PORT}`);
});
