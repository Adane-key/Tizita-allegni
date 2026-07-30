const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const { requireAuth } = require("../lib/auth");

// Rent booking
router.post("/cars/:id/book", requireAuth, (req, res) => {
  const car = db.getCarById(req.params.id);
  if (!car) return res.status(404).render("error", { message: "Car not found." });

  const { startDate, endDate } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  if (!startDate || !endDate || isNaN(start) || isNaN(end) || end < start) {
    return res.render("car-detail", {
      car,
      bookingError: "Please choose a valid date range.",
    });
  }

  const totalPrice = days * (car.rentPricePerDay || 0);

  db.addBooking({
    userId: req.session.userId,
    carId: car.id,
    type: "rent",
    startDate,
    endDate,
    totalPrice,
    status: "pending",
  });

  res.redirect("/dashboard?success=booking");
});

// Buy inquiry
router.post("/cars/:id/buy", requireAuth, (req, res) => {
  const car = db.getCarById(req.params.id);
  if (!car) return res.status(404).render("error", { message: "Car not found." });

  db.addBooking({
    userId: req.session.userId,
    carId: car.id,
    type: "sell",
    startDate: null,
    endDate: null,
    totalPrice: car.sellPrice || 0,
    status: "pending",
  });

  res.redirect("/dashboard?success=inquiry");
});

// Dashboard
router.get("/dashboard", requireAuth, (req, res) => {
  const bookings = db.getUserBookings(req.session.userId).map((b) => ({
    ...b,
    car: db.getCarById(b.carId),
  }));
  res.render("dashboard", { bookings, success: req.query.success || null });
});

module.exports = router;
