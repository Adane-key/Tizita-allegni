const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function genId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Users ----------
function getUsers() {
  return readDB().users;
}

function findUserByEmail(email) {
  return readDB().users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
}

function findUserById(id) {
  return readDB().users.find((u) => u.id === id);
}

function addUser(user) {
  const db = readDB();
  const newUser = {
    id: genId("u"),
    createdAt: new Date().toISOString(),
    role: "customer",
    ...user,
  };
  db.users.push(newUser);
  writeDB(db);
  return newUser;
}

// ---------- Cars ----------
function getCars(filter = {}) {
  let cars = readDB().cars;
  if (filter.listingType) {
    cars = cars.filter(
      (c) => c.listingType === filter.listingType || c.listingType === "both"
    );
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    cars = cars.filter(
      (c) =>
        c.titleEn.toLowerCase().includes(q) ||
        c.titleAm.includes(filter.search) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q)
    );
  }
  return cars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getCarById(id) {
  return readDB().cars.find((c) => c.id === id);
}

function addCar(car) {
  const db = readDB();
  const newCar = {
    id: genId("c"),
    createdAt: new Date().toISOString(),
    status: "available",
    ...car,
  };
  db.cars.push(newCar);
  writeDB(db);
  return newCar;
}

function updateCar(id, updates) {
  const db = readDB();
  const idx = db.cars.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  db.cars[idx] = { ...db.cars[idx], ...updates };
  writeDB(db);
  return db.cars[idx];
}

function deleteCar(id) {
  const db = readDB();
  db.cars = db.cars.filter((c) => c.id !== id);
  writeDB(db);
}

// ---------- Bookings ----------
function getBookings() {
  return readDB()
    .bookings.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getUserBookings(userId) {
  return getBookings().filter((b) => b.userId === userId);
}

function addBooking(booking) {
  const db = readDB();
  const newBooking = {
    id: genId("b"),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...booking,
  };
  db.bookings.push(newBooking);
  writeDB(db);
  return newBooking;
}

function updateBooking(id, updates) {
  const db = readDB();
  const idx = db.bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  db.bookings[idx] = { ...db.bookings[idx], ...updates };
  writeDB(db);
  return db.bookings[idx];
}

module.exports = {
  readDB,
  writeDB,
  genId,
  getUsers,
  findUserByEmail,
  findUserById,
  addUser,
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
  getBookings,
  getUserBookings,
  addBooking,
  updateBooking,
};
