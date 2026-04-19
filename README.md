# 🪔 Divyam — Sacred Puja Essentials (MERN E-commerce)

A full-featured, production-ready e-commerce platform for Hindu puja items — idols, diyas, incense, thali sets, rudraksha, yantras and more. Built with a warm saffron/maroon aesthetic that feels authentic and modern.

**Tech stack:** React + Vite + TailwindCSS • Node.js + Express • MongoDB (Mongoose) • JWT auth

## ✨ Features

### Storefront
- Stunning hero landing with devanagari accents, Framer Motion animations
- 16 curated puja categories with 60+ seeded products
- Advanced shop filters — category, price range, sort (new / price / rating / popularity)
- Rich product detail page with image gallery, reviews, related products
- **Add to Cart** with live quantity/subtotal
- **Add to Favorites (wishlist)**
- Full checkout flow — multi-address book, payment method selection (COD/UPI/CARD)
- Order success page, order history, order tracking with progress stepper
- User profile, editable addresses (with default-address logic)
- Responsive, mobile-first, aesthetic UI

### Admin Panel (`/admin`)
- Secure role-based access (JWT)
- Dashboard with revenue, orders, users, categories, recent orders
- CRUD Products (with image URLs, SEO slug, flags for featured/trending/bestseller)
- CRUD Categories
- Manage Orders — update status (pending → confirmed → shipped → delivered / cancelled)
- View Users

### Backend
- REST API with auth/products/categories/cart/favorites/orders/addresses/admin
- bcrypt password hashing + JWT
- Mongoose schemas with virtuals, validation
- Review system with rating aggregation
- Order flow automatically decrements stock, computes tax & shipping

## 📦 Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or set your own URI)

### 1️⃣ Backend

```powershell
cd backend
cp .env.example .env   # or copy manually on Windows
npm install
npm run seed           # seeds categories, products and admin user
npm run dev            # starts at http://localhost:5000
```

### 2️⃣ Frontend

```powershell
cd frontend
npm install
npm run dev            # starts at http://localhost:5173
```

Open http://localhost:5173 🪔

## 🔐 Default Admin

- **Email:** `admin@divyam.com`
- **Password:** `admin@123`

(Configurable via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env`.)

## 🗂 Project structure

```
Plumose/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # auth, product, category, cart, favorite, order, address, admin
│   ├── middleware/         # auth, error handler
│   ├── models/             # User, Category, Product, Cart, Favorite, Address, Order
│   ├── routes/
│   ├── utils/
│   ├── seed.js             # seed script
│   └── server.js
└── frontend/
    ├── src/
    │   ├── admin/          # admin panel pages + layout
    │   ├── api/client.js   # axios instance
    │   ├── components/     # Navbar, Footer, ProductCard, etc.
    │   ├── context/        # Auth, Cart, Favorite contexts
    │   ├── pages/          # Home, Shop, ProductDetail, Cart, Checkout, ...
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

## 🛠 API Endpoints (summary)

| Method | Route | Auth |
|-------|-------|------|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| GET | `/api/auth/me` | user |
| GET | `/api/products?category=&search=&sort=&min=&max=` | — |
| GET | `/api/products/:slug` | — |
| POST | `/api/products` | admin |
| GET | `/api/categories` | — |
| GET/POST | `/api/cart` | user |
| POST | `/api/favorites/toggle` | user |
| POST | `/api/orders` | user |
| GET | `/api/orders/my` | user |
| GET | `/api/orders/all` | admin |
| GET | `/api/admin/stats` | admin |

## 🙏 Categories seeded

Idols & Murtis · Diyas & Lamps · Incense & Dhoop · Puja Thali Sets · Bells & Ghanti · Kalash & Lota · Chunri & Vastra · Rudraksha & Malas · Yantras · Havan Samagri · Puja Oils & Ghee · Kumkum & Chandan · Flowers & Garlands · Chowki & Asan · Puja Books & Aartis · Shankh & Conch

---

**॥ शुभं करोति कल्याणम् ॥**  
Crafted with devotion 🪔
