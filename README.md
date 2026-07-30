# NATHY CAR

A bilingual (English / Amharic) car rental & sales web app for **NATHY CAR**, based in
Hossana, Central Ethiopia. Customers register, browse cars, and book a rental or
submit a purchase inquiry. An admin panel manages the car inventory and bookings.

---

## 1. Features

- 🔐 Customer registration & login (required before booking/buying)
- 🚗 Car catalogue — filter by **For Rent** / **For Sale**, search by brand/model
- 📅 Rent booking with live estimated total (days × daily rate)
- 🛒 "Inquire to buy" flow for cars listed for sale
- 🗂️ Customer dashboard — track booking/inquiry status
- 🛠️ Admin dashboard — add/edit/delete cars, confirm or cancel bookings
- 🌐 Full English + Amharic UI, switchable anytime via the language toggle
- 📱 Responsive, mobile-friendly design

Data is stored in a simple JSON file (`data/db.json`) — no database server required.
This keeps setup and deployment simple. (See "Scaling up" below if you outgrow it.)

---

## 2. Run locally

Requirements: [Node.js](https://nodejs.org) 18 or newer.

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment example and edit it
cp .env.example .env
# Open .env and set a real SESSION_SECRET (any long random string)

# 3. Start the app
npm start
```

Visit **http://localhost:3000**

### Default admin account

On first run, the app automatically creates an admin account if none exists:

- **Email:** `admin@nathycar.com`
- **Password:** `admin123`

⚠️ **Log in and change this immediately** (there's no "change password" screen yet —
for now, edit `data/db.json` and replace the admin's `passwordHash` with a new
bcrypt hash, or delete the admin user entry and restart the server to regenerate one).

---

## 3. Push this project to GitHub

From inside this folder:

```bash
git init
git add .
git commit -m "Initial commit: NATHY CAR website"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Replace `<your-username>` and `<your-repo-name>` with your actual GitHub username and
a new (empty) repository you've created on GitHub.

> `node_modules/` and `.env` are already excluded via `.gitignore` — don't commit them.

---

## 4. Deploy to Railway

1. Go to [railway.app](https://railway.app) and log in.
2. Click **New Project → Deploy from GitHub repo**, and select the repo you just pushed.
3. Railway will detect it's a Node app (via `package.json`) and use `npm start` to run it
   automatically (a `Procfile` is also included as a backup).
4. Open your new service → **Variables** tab, and add:
   - `SESSION_SECRET` = a long random string
   - `NODE_ENV` = `production`
   - (Railway sets `PORT` automatically — the app already reads `process.env.PORT`.)
5. Go to **Settings → Networking → Generate Domain** to get a public URL.
6. Visit the generated URL — your site is live!

### Important note about data persistence on Railway

This app stores cars/users/bookings in `data/db.json` on disk. Railway's filesystem
for a standard deployment **resets on every redeploy**, so any cars/bookings added
after launch will be lost when you push a new version. For a real production
launch, consider:

- Attaching a [Railway Volume](https://docs.railway.com/reference/volumes) mounted at
  `/data`, and pointing `DB_PATH` there (small code change in `lib/db.js`), **or**
- Migrating to Railway's managed PostgreSQL add-on for a proper database.

For getting the business online quickly and testing with real customers, the
included JSON file storage works fine.

---

## 5. Project structure

```
nathy-car/
├── server.js              # App entry point
├── routes/                # Express route handlers
│   ├── index.js           # Home page, language switch
│   ├── auth.js             # Register / login / logout
│   ├── cars.js             # Car listing & detail pages
│   ├── bookings.js         # Rent booking, buy inquiry, dashboard
│   └── admin.js             # Admin car & booking management
├── views/                  # EJS templates
├── public/                 # CSS, JS, images
├── locales/                 # en.json / am.json translation strings
├── lib/                     # db.js, auth.js, i18n.js helpers
├── data/db.json             # JSON "database" (cars, users, bookings)
├── .env.example
├── Procfile
└── package.json
```

---

## 6. Customizing

- **Business info** (phone, address): edit `views/partials/footer.ejs` and the
  `location_label` / `footer_phone` values in `locales/en.json` & `locales/am.json`.
- **Add a car**: log in as admin → **Admin** → **Add New Car**.
- **Colors/fonts**: edit the CSS variables at the top of `public/css/style.css`.
- **Translations**: every UI string lives in `locales/en.json` and `locales/am.json` —
  edit both to keep them in sync.

---

Built for NATHY CAR — Hossana, Central Ethiopia. 🚗
