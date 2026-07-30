const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.get("/", (req, res) => {
  const featured = db.getCars().slice(0, 6);
  res.render("home", { featured });
});

router.get("/lang/:lng", (req, res) => {
  const lng = req.params.lng === "am" ? "am" : "en";
  req.session.lang = lng;
  const back = req.get("Referrer") || "/";
  res.redirect(back);
});

module.exports = router;
