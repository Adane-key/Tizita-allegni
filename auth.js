const db = require("./db");

function loadUser(req, res, next) {
  if (req.session && req.session.userId) {
    const user = db.findUserById(req.session.userId);
    res.locals.currentUser = user || null;
  } else {
    res.locals.currentUser = null;
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    req.session.redirectAfterLogin = req.originalUrl;
    return res.redirect("/login");
  }
  next();
}

function requireAdmin(req, res, next) {
  const user = res.locals.currentUser;
  if (!user || user.role !== "admin") {
    return res.status(403).render("error", {
      message: "Access denied. Admins only.",
    });
  }
  next();
}

module.exports = { loadUser, requireAuth, requireAdmin };
