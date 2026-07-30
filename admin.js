const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const { requireAuth, requireAdmin } = require("../lib/auth");

router.use(requireAuth, requireAdmin);

router.get("/", (req, res) => {
  const cars = db.getCars();
  const bookings = db.getBookings().map((b) => ({
    ...b,
    car: db.getCarById(b.carId),
    user: db.findUserById(b.userId),
  }));
  res.render("admin/dashboard", { cars, bookings });
});

router.get("/cars/new", (req, res) => {
  res.render("admin/car-form", { car: null });
});

router.post("/cars/new", (req, res) => {
  const b = req.body;
  db.addCar({
    brand: b.brand,
    model: b.model,
    year: Number(b.year) || null,
    titleEn: b.titleEn,
    titleAm: b.titleAm,
    descEn: b.descEn,
    descAm: b.descAm,
    listingType: b.listingType,
    rentPricePerDay: b.rentPricePerDay ? Number(b.rentPricePerDay) : null,
    sellPrice: b.sellPrice ? Number(b.sellPrice) : null,
    currency: "ETB",
    image: b.image || "/images/car-placeholder.svg",
    status: "available",
  });
  res.redirect("/admin");
});

router.get("/cars/:id/edit", (req, res) => {
  const car = db.getCarById(req.params.id);
  if (!car) return res.status(404).render("error", { message: "Car not found." });
  res.render("admin/car-form", { car });
});

router.post("/cars/:id/edit", (req, res) => {
  const b = req.body;
  db.updateCar(req.params.id, {
    brand: b.brand,
    model: b.model,
    year: Number(b.year) || null,
    titleEn: b.titleEn,
    titleAm: b.titleAm,
    descEn: b.descEn,
    descAm: b.descAm,
    listingType: b.listingType,
    rentPricePerDay: b.rentPricePerDay ? Number(b.rentPricePerDay) : null,
    sellPrice: b.sellPrice ? Number(b.sellPrice) : null,
    image: b.image || "/images/car-placeholder.svg",
    status: b.status || "available",
  });
  res.redirect("/admin");
});

router.post("/cars/:id/delete", (req, res) => {
  db.deleteCar(req.params.id);
  res.redirect("/admin");
});

router.post("/bookings/:id/status", (req, res) => {
  db.updateBooking(req.params.id, { status: req.body.status });
  res.redirect("/admin");
});

module.exports = router;
