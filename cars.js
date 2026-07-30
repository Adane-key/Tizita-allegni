const express = require("express");
const router = express.Router();
const db = require("../lib/db");

router.get("/", (req, res) => {
  const { type, search } = req.query;
  const filter = {};
  if (type && ["rent", "sell"].includes(type)) filter.listingType = type;
  if (search) filter.search = search;

  const cars = db.getCars(filter);
  res.render("cars", { cars, activeType: type || "all", search: search || "" });
});

router.get("/:id", (req, res) => {
  const car = db.getCarById(req.params.id);
  if (!car) return res.status(404).render("error", { message: "Car not found." });
  res.render("car-detail", { car, bookingError: null });
});

module.exports = router;
