# 🗂️ BRGFinery — Complete Folder Structure Explanation

> A **premium luxury apparel e-commerce web application** built with **Next.js 16**, **MongoDB (Mongoose)**, **NextAuth v5**, **Cloudinary**, and **Razorpay**. This document explains every folder, every file — what it is, why it exists, and how it works.

---

## 🌳 Root Level Overview

```
BRGFinery/
├── app/                    ← Next.js App Router (all pages + API routes)
├── components/             ← Reusable React UI components
├── lib/                    ← Utilities, DB connection, auth, validation
├── models/                 ← Mongoose database schemas/models
├── types/                  ← Global TypeScript type declarations
├── public/                 ← Static assets served directly
├── scripts/                ← One-time utility scripts (seeding, admin setup)
├── .next/                  ← Next.js build output (auto-generated, not edited)
├── node_modules/           ← All installed npm packages (not edited)
├── .env.local              ← Secret environment variables (never commit to git)
├── .gitignore              ← Files git should ignore
├── next.config.ts          ← Next.js configuration
├── package.json            ← Project dependencies and scripts
├── tsconfig.json           ← TypeScript compiler settings
├── tsconfig.seed.json      ← Separate TS config for running seed scripts
├── postcss.config.mjs      ← PostCSS config (for Tailwind CSS processing)
├── eslint.config.mjs       ← ESLint code linting rules
├── proxy.ts                ← Custom dev-server proxy helper
├── AGENTS.md               ← AI agent instructions for this project
├── Architecture.md         ← Technical architecture documentation
├── Database-schema.md      ← MongoDB schema documentation
├── Project-context.md      ← Project overview and goals
├── Project-rules.md        ← Development rules and conventions
├── Roadmap.md              ← Feature roadmap
├── actionable.md           ← Detailed task/implementation checklist
└── wiki.md                 ← Internal wiki / knowledge base
```

---

## 📁 `app/` — The Heart of the Application (Next.js App Router)

This folder follows Next.js 13+ **App Router** conventions. Every folder inside `app/` that contains a `page.tsx` becomes a **URL route**. Special files like `layout.tsx` define shared UI wrappers.

### Key Concept: Route Groups `(folderName)`
Folders wrapped in parentheses like `(admin)`, `(auth)`, `(customer)` are called **Route Groups**. They **don't become part of the URL** — they're just used to group related pages together and apply different layouts to each group.

---

### 📄 `app/layout.tsx` — Root Layout (Applied to EVERY page)

**What:** The outermost HTML wrapper for the entire application.

**Why:** Every single page in the app is wrapped by this. It's the perfect place to:
- Load global fonts
- Set the default `<html>` and `<body>` attributes
- Wrap the whole app in global context providers

**How it works:**
- Loads **Cormorant Garamond** (elegant serif font for headings) and **Inter** (clean sans-serif for body text) from Google Fonts
- Wraps everything in `SessionProvider` (makes the user's login session available everywhere)
- Wraps everything in `CartProvider` (makes the shopping cart state available everywhere)
- Sets the dark background color `#0a0a0a` and light text `#f5f5f5` as the base theme

```tsx
// Every page renders inside these providers automatically
<SessionProvider>
  <CartProvider>
    {children}  ← your actual page content goes here
  </CartProvider>
</SessionProvider>
```

---

### 📄 `app/page.tsx` — Home Page (URL: `/`)

**What:** The landing page of the entire website.

**Why:** This is what users see first. It showcases the brand and drives engagement.

**How it works:**
- It's an **async Server Component** — it fetches data directly from MongoDB on the server before sending HTML to the browser (no loading spinner needed)
- Fetches top 6 categories and top 8 featured products (sorted by highest ratings)
- Renders 6 sections: `Navbar → HeroCarousel → TrendCarousel → ShopByCategory → MonsoonSaleBanner → SubscribeSection → Footer`

---

### 📄 `app/globals.css` — Global Styles

**What:** The single CSS file that applies styles to the whole app.

**Why:** Defines custom CSS variables (color tokens, font variables) used throughout the design system. Also imports Tailwind CSS.

---

### 📄 `app/favicon.ico` — Browser Tab Icon

**What:** The small icon shown in the browser tab.

**Why:** Branding — placed here so Next.js auto-serves it at `/favicon.ico`.

---

### 📁 `app/(auth)/` — Authentication Route Group

This group contains login and registration pages. They share a clean, minimal layout (no navbar/footer, just the form).

#### `app/(auth)/login/page.tsx` — Login Page (URL: `/login`)
- Renders the email + password login form
- On submit, calls NextAuth's `signIn()` function
- Redirects to `/shop` on success or back to `/login?error=...` on failure

#### `app/(auth)/register/page.tsx` — Registration Page (URL: `/register`)
- Renders the sign-up form (name, email, password)
- Calls the `/api/auth/register` API route to create the user in MongoDB
- Hashes the password using `bcryptjs` before storing it

---

### 📁 `app/(customer)/` — Customer-Facing Route Group

These are the pages that logged-in customers (shoppers) use. They all share the same layout with `Navbar` and `Footer`.

#### `app/(customer)/shop/page.tsx` — Shop Page (URL: `/shop`)
- Lists all active products in a grid
- Has a `FilterBar` on the left/top for filtering by category, price range, etc.
- Reads filters from URL search params (e.g., `/shop?category=shirts&maxPrice=5000`)
- Fully server-rendered — data fetched directly from MongoDB

#### `app/(customer)/shop/[slug]/` — Individual Product Page (URL: `/shop/t-shirts`)
- Dynamic route — `[slug]` gets replaced by the product's slug (e.g., `premium-cotton-tee`)
- Shows full product detail: image gallery, description, price, reviews, add-to-cart button

#### `app/(customer)/categories/page.tsx` — All Categories Page (URL: `/categories`)
- Lists all product categories as cards with images

#### `app/(customer)/categories/[slug]/` — Category Products Page (URL: `/categories/shirts`)
- Shows all products belonging to a specific category

#### `app/(customer)/cart/page.tsx` — Shopping Cart (URL: `/cart`)
- Shows items in the user's cart (fetched from MongoDB Cart collection)
- Allows changing quantity or removing items
- Has a "Proceed to Checkout" button

#### `app/(customer)/orders/page.tsx` — Order History (URL: `/orders`)
- Lists all past orders for the logged-in customer
- Shows order status badges (pending / confirmed / shipped / delivered / cancelled)

#### `app/(customer)/orders/[id]/` — Single Order Detail (URL: `/orders/abc123`)
- Shows full details of one specific order: items, quantities, shipping address, payment status

#### `app/(customer)/profile/page.tsx` — User Profile (URL: `/profile`)
- Shows account details (name, email)
- Allows managing saved shipping addresses
- Has a logout button (`ProfileLogoutButton.tsx` is a tiny client component just for the logout action)

---

### 📁 `app/(admin)/` — Admin Panel Route Group

Only users with `role: "admin"` can access these pages. If a non-admin tries to access them, they get redirected. They share a special admin layout with a sidebar.

#### `app/(admin)/admin/layout.tsx` — Admin Layout
- Provides the persistent admin sidebar navigation (links to Dashboard, Products, Orders, Categories, Users, Analytics)
- All admin pages are wrapped by this layout automatically

#### `app/(admin)/admin/page.tsx` — Admin Dashboard (URL: `/admin`)
- Shows key stats: total revenue, total orders, total users, active products
- Quick overview for the store manager

#### `app/(admin)/admin/products/page.tsx` — Products List (URL: `/admin/products`)
- Lists all products in the store (both active and inactive)
- Buttons to Add New Product, Edit, or Delete each product

#### `app/(admin)/admin/products/new/` — Add New Product (URL: `/admin/products/new`)
- Uses the `ProductForm` component
- Admin fills in: name, description, price, stock, category, images (uploaded to Cloudinary)

#### `app/(admin)/admin/products/[id]/edit/` — Edit Product (URL: `/admin/products/abc123/edit`)
- Same `ProductForm` component, but pre-filled with existing product data

#### `app/(admin)/admin/products/AdminProductActions.tsx`
- A small client component rendering the Edit/Delete action buttons for each product row
- Must be client-side because delete requires a confirmation dialog + fetch call

#### `app/(admin)/admin/categories/page.tsx` — Categories Manager (URL: `/admin/categories`)
- List, create, edit, and delete product categories

#### `app/(admin)/admin/orders/page.tsx` — Orders Manager (URL: `/admin/orders`)
- Lists all customer orders with their current status
- Admin can update status (e.g., mark as "shipped") using the `AdminOrderStatusSelect` dropdown

#### `app/(admin)/admin/orders/AdminOrderStatusSelect.tsx`
- A client component — a `<select>` dropdown that immediately fires an API call when the admin changes an order's status

#### `app/(admin)/admin/users/page.tsx` — Users Manager (URL: `/admin/users`)
- Lists all registered customers with their details

#### `app/(admin)/admin/analytics/page.tsx` — Analytics (URL: `/admin/analytics`)
- Renders the `AnalyticsDashboard` component showing charts and metrics

#### `app/(admin)/admin/analytics/AnalyticsDashboard.tsx`
- A client component (uses browser-side chart rendering)
- Fetches analytics data from `/api/admin/analytics` and sub-routes
- Displays: revenue over time, top-selling products, top customers, low-stock alerts

---

### 📁 `app/contactus/` — Contact Page (URL: `/contactus`)

A standalone page outside any route group — no special layout override.
- Contact form for customers to reach the store
- Rendered with its own Navbar and Footer

---

### 📁 `app/api/` — Backend API Routes

This is where all server-side logic lives that the frontend calls. Every `route.ts` file inside `app/api/` becomes an HTTP endpoint.

> **Key Concept:** In Next.js App Router, `route.ts` files export async functions named `GET`, `POST`, `PUT`, `PATCH`, `DELETE` that handle HTTP requests. No separate Express/backend server needed.

---

#### `app/api/auth/[...nextauth]/` — NextAuth Handler
**URL:** `/api/auth/*` (e.g., `/api/auth/session`, `/api/auth/signin`)

- The `[...nextauth]` is a **catch-all route** — it catches any path starting with `/api/auth/`
- NextAuth handles all authentication flows internally (sign in, sign out, session checks, JWT tokens)
- You don't write code here — NextAuth generates all the handlers from `lib/auth.ts`

---

#### `app/api/products/route.ts` — Public Products List
**URL:** `GET /api/products`

- Returns paginated, filtered list of active products
- Supports query params: `?category=`, `?minPrice=`, `?maxPrice=`, `?search=`, `?page=`

#### `app/api/products/[slug]/` — Single Product by Slug
**URL:** `GET /api/products/premium-tee`

- Returns full product details including images, category, rating

---

#### `app/api/cart/route.ts` — Cart GET/POST
**URL:** `GET /api/cart` → Fetch the current user's cart  
**URL:** `POST /api/cart` → Replace/set the cart

#### `app/api/cart/items/` — Cart Item Operations
**URL:** `PATCH /api/cart/items` → Update quantity of a specific item  
**URL:** `DELETE /api/cart/items` → Remove an item from cart

---

#### `app/api/checkout/` — Checkout Flow (3 steps)

The checkout is a 3-step process powered by Razorpay:

**Step 1 — `initiate/`:** `POST /api/checkout/initiate`
- Validates the cart and checks stock
- Creates a **Razorpay Order** (generates a Razorpay order ID)
- Returns the Razorpay order ID + amount to the frontend

**Step 2 — `create-order/`:** `POST /api/checkout/create-order`
- Called after Razorpay payment modal opens (on the frontend)
- Creates an Order document in MongoDB with `payment.status: "created"`

**Step 3 — `confirm/`:** `POST /api/checkout/confirm`
- Called after the user completes payment in the Razorpay popup
- Verifies the Razorpay payment signature cryptographically (using HMAC SHA-256)
- If valid: marks order as paid, decrements product stock, clears the user's cart

---

#### `app/api/orders/route.ts` — Customer Orders List
**URL:** `GET /api/orders`

- Returns all orders belonging to the currently logged-in user

#### `app/api/orders/[id]/` — Single Order Detail
**URL:** `GET /api/orders/abc123`

- Returns full order details (only if the order belongs to the requesting user)

---

#### `app/api/categories/route.ts` — Public Categories List
**URL:** `GET /api/categories`

- Returns all categories (used by navbar, filter bar, shop-by-category section)

---

#### `app/api/admin/` — Admin-Only API Routes

All routes here call `requireAdmin()` at the top — if the user isn't an admin, they get a `403 Forbidden` response immediately.

**`app/api/admin/products/route.ts`** — `POST /api/admin/products` → Create a new product  
**`app/api/admin/products/[id]/route.ts`** — `PUT /api/admin/products/:id` → Update product, `DELETE` → Delete product  

**`app/api/admin/categories/[id]/route.ts`** — Full CRUD for categories  

**`app/api/admin/orders/route.ts`** — `GET /api/admin/orders` → All orders (for admin view)  
**`app/api/admin/orders/[id]/route.ts`** — `PATCH /api/admin/orders/:id` → Update order status  

**`app/api/admin/upload/`** (empty — route planned) → Image upload to Cloudinary  

**`app/api/admin/analytics/route.ts`** — Main analytics stats (total revenue, orders, users)  
**`app/api/admin/analytics/revenue/`** — Revenue breakdown over time  
**`app/api/admin/analytics/top-products/`** — Best-selling products  
**`app/api/admin/analytics/top-customers/`** — Highest-spending customers  
**`app/api/admin/analytics/low-stock/`** — Products running low on stock  
**`app/api/admin/analytics/customer/`** — Individual customer analytics  

---

## 📁 `components/` — Reusable UI Components

Components are separated by the feature/section they belong to. None of them contain any API route logic — they're purely UI.

### `components/ui/` — Global UI Components (used everywhere)

#### `Navbar.tsx`
The top navigation bar displayed on all customer-facing pages.
- **What:** Logo, navigation links (Home, Shop, Categories), user account dropdown (with cart icon + item count), login/logout
- **Why:** Persistent navigation is central to the UX
- **How:** It's a **Server Component** by default but uses `useSession()` for showing user-specific UI (cart count, profile link)

#### `Footer.tsx`
The bottom footer on all customer pages.
- Brand info, navigation links, social media links, copyright

---

### `components/home/` — Homepage-Specific Components

#### `HeroCarousel.tsx`
**What:** The large, full-width image slideshow at the top of the home page.  
**How:** Uses CSS transitions to auto-advance between hero images stored in `public/`. Has prev/next buttons and dot indicators.

#### `TrendCarousel.tsx`
**What:** A **physics-based rotating carousel** showing featured products in a curved arc — the visually striking centerpiece of the homepage.  
**How:** Uses JavaScript to calculate 3D-like curved positions for product cards. Handles mouse drag and touch swipe gestures.

#### `TrendProductCard.tsx`
**What:** Individual product card inside the TrendCarousel.  
**How:** Shows product image, name, price, rating. Clicking navigates to the product page. Has an "Add to Cart" button.

#### `ShopByCategory.tsx`
**What:** A section showing category cards with images and item counts.  
**How:** Renders the categories fetched from MongoDB in the home page's server component. Clicking a category goes to `/categories/[slug]`.

#### `MonsoonSaleBanner.tsx`
**What:** A promotional banner with a sale announcement, countdown timer, or offer text.  
**Why:** Drives conversion by creating urgency.

#### `SubscribeSection.tsx`
**What:** Email newsletter sign-up section.  
**Why:** Captures leads for marketing outreach.

---

### `components/product/` — Product-Related Components

#### `ProductCard.tsx`
**What:** A standard product card shown in the `/shop` grid and `/categories/[slug]` pages.  
**How:** Shows product thumbnail, name, price, rating stars. Links to the product detail page.

#### `FilterBar.tsx`
**What:** The sidebar/top bar on the Shop page for filtering products.  
**How:** Manages filter state (category, min price, max price, search term) and updates the URL search params — this triggers a server-side data re-fetch without a full page reload.

#### `ProductImageGallery.tsx`
**What:** The image viewer on the product detail page.  
**How:** Shows a large main image with thumbnail strip below. Clicking a thumbnail swaps the main image. Supports images hosted on Cloudinary.

---

### `components/cart/` — Cart Components

#### `CartContext.tsx`
**What:** A React **Context Provider** that holds the cart state globally.  
**Why:** Multiple components need cart data (Navbar shows count, Cart page shows items, product page has "Add to Cart"). Context avoids prop-drilling.  
**How:** Wraps the whole app in `layout.tsx`. Exposes `cartItems`, `addToCart()`, `removeFromCart()`, `updateQuantity()` functions. Syncs with the `/api/cart` endpoints.

#### `AddToCartButton.tsx`
**What:** The "Add to Cart" button component used on product pages and product cards.  
**How:** It's a **Client Component** (`"use client"`) because it needs to respond to click events. On click, calls the `addToCart()` function from `CartContext`. Shows loading state during the API call.

---

### `components/checkout/` — Checkout Components (empty directory)
Planned location for checkout UI components (e.g., order summary, payment form). Currently the checkout UI is handled directly in the cart/checkout pages.

---

### `components/admin/` — Admin-Only Components

#### `ProductForm.tsx`
**What:** The large form used for both creating and editing products.  
**Why:** Reused in both `/admin/products/new` and `/admin/products/[id]/edit` to avoid duplicating form code.  
**How:** Controlled form with all product fields (name, slug, description, price, stock, category selector, image upload). Handles image upload to Cloudinary via the admin upload API. Validates input using Zod before submitting.

#### `AdminSearchInput.tsx`
**What:** A debounced search input used in admin list pages.  
**How:** As the admin types, it waits 300ms (debounce) then updates the URL search params to filter the list — no button press needed.

---

## 📁 `lib/` — Shared Utility / Library Code

This folder contains reusable server-side utilities that multiple API routes and pages use.

### `lib/db/connect.ts` — MongoDB Connection

**What:** Establishes and reuses a single connection to MongoDB.  
**Why:** In Next.js, API routes run as serverless functions — each call could create a new DB connection, which would exhaust the connection pool rapidly.  
**How:** Uses a **global cache pattern** (`global.mongooseCache`). On first call, it opens the connection and caches it. On every subsequent call (even across different API routes in the same process), it reuses the existing connection. This is the standard Next.js + Mongoose pattern.

```typescript
if (cached.conn) return cached.conn; // reuse existing
if (!cached.promise) {
  cached.promise = mongoose.connect(MONGODB_URI); // create new only if needed
}
```

---

### `lib/auth.ts` — Authentication Configuration

**What:** The single source of truth for NextAuth v5 configuration.  
**Why:** Centralizes all auth logic — login strategy, session shape, guards.  
**How:**
- Uses **Credentials provider** (email + password) — not Google/GitHub OAuth
- Uses **JWT strategy** (session is stored in a signed cookie, no DB session table needed)
- The `jwt` callback adds `userId` and `role` to the JWT token on login
- The `session` callback copies `userId` and `role` from the token into the session object
- Exports `requireAdmin()` — a guard function called at the top of admin API routes
- Exports `requireAuth()` — a guard function for customer-only API routes

---

### `lib/cloudinary.ts` — Cloudinary Image Upload

**What:** Configures the Cloudinary SDK and exports an `uploadImage()` helper.  
**Why:** Product images need to be stored in the cloud (not locally), so they're accessible from anywhere and served via CDN.  
**How:**
- Reads `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` from environment variables
- `uploadImage(fileBuffer, folder)` takes a binary Buffer (raw file data), streams it to Cloudinary, and returns the image's `url` and `publicId`

---

### `lib/razorpay.ts` — Razorpay Payment Configuration

**What:** Initializes the Razorpay SDK and exports a payment signature verifier.  
**Why:** Payment gateway needs to be initialized once with secret keys.  
**How:**
- `razorpay` — the initialized Razorpay client (used to create payment orders server-side)
- `verifyRazorpaySignature()` — cryptographically verifies that a payment confirmation came genuinely from Razorpay (prevents fraud). Uses HMAC SHA-256 hashing.

---

### `lib/validations/` — Zod Validation Schemas

These files define the **shape and rules** for data coming into the API. Zod validates at runtime so even if someone sends a malformed request, it's rejected cleanly.

| File | What it validates |
|------|------------------|
| `user.schema.ts` | Register form (name, email, password length), Login form (email, password) |
| `product.schema.ts` | New/edit product (name required, price must be positive number, stock must be integer ≥ 0) |
| `category.schema.ts` | Category name and slug |
| `cart.schema.ts` | Cart item (productId must be valid ObjectId, quantity must be ≥ 1) |
| `order.schema.ts` | Full order creation (items array, shipping address, totals) |
| `review.schema.ts` | Product review (rating 1–5, comment text) |

---

## 📁 `models/` — Mongoose Database Schemas

These files define the **shape of your MongoDB documents** — what fields exist, what type they are, whether they're required, and indexes for fast querying.

### `User.model.ts`
**MongoDB Collection:** `users`

| Field | Type | Purpose |
|-------|------|---------|
| `name` | String | Display name |
| `email` | String (unique) | Login identifier |
| `passwordHash` | String | bcrypt hashed password (never store plain text!) |
| `role` | `"customer"` or `"admin"` | Controls access level throughout the app |
| `addresses` | Array of Address objects | Saved shipping addresses (embedded sub-documents) |

The `IAddress` sub-schema stores: label (e.g., "Home"), line1, line2, city, state, pincode, isDefault.

---

### `Product.model.ts`
**MongoDB Collection:** `products`

| Field | Type | Purpose |
|-------|------|---------|
| `name` | String | Product display name |
| `slug` | String (unique) | URL-friendly identifier (e.g., `premium-black-tee`) |
| `description` | String | Full product description |
| `price` | Number | **Stored in paise** (₹100 = `10000` paise) to avoid floating-point errors |
| `stock` | Number | Available inventory count |
| `categoryId` | ObjectId → Category | Which category this product belongs to |
| `images` | Array of `{url, publicId}` | Cloudinary image URLs + IDs for deletion |
| `isActive` | Boolean | Whether the product is visible to customers |
| `ratingAvg` | Number (0–5) | Average star rating |
| `ratingCount` | Number | How many reviews have been submitted |

**Indexes:** `categoryId`, `price`, `stock`, full-text on `name+description`, compound `categoryId+price` for filtered queries.

---

### `Category.model.ts`
**MongoDB Collection:** `categories`

| Field | Type | Purpose |
|-------|------|---------|
| `name` | String | Display name (e.g., "T-Shirts") |
| `slug` | String (unique) | URL key (e.g., `t-shirts`) |

Simple model. Products reference categories via `categoryId`.

---

### `Order.model.ts`
**MongoDB Collection:** `orders`

| Field | Type | Purpose |
|-------|------|---------|
| `userId` | ObjectId → User | Which customer placed the order |
| `items` | Array of snapshots | **Snapshot** of product name + price at time of purchase (so if product price changes later, the order history still shows correct price) |
| `shippingAddressSnapshot` | Embedded address | Snapshot of the shipping address (same reason as above) |
| `subtotal`, `tax`, `total` | Numbers | Order financial totals (in paise) |
| `status` | Enum | `pending → confirmed → shipped → delivered` or `cancelled` |
| `payment` | Embedded object | Razorpay order ID, payment ID, payment status |

**Indexes:** `userId + createdAt` (for fetching a user's order history fast), `status + createdAt` (for admin order management), `payment.razorpayOrderId` (for payment verification lookups).

---

### `Cart.model.ts`
**MongoDB Collection:** `carts`

| Field | Type | Purpose |
|-------|------|---------|
| `userId` | ObjectId → User (unique) | One cart per user enforced at DB level |
| `items` | Array of `{productId, quantity}` | **No price stored** — cart always fetches live price when displayed (prevents showing stale prices) |

---

### `Review.model.ts`
**MongoDB Collection:** `reviews`

Stores product reviews. When a review is submitted, the `Product`'s `ratingAvg` and `ratingCount` are recalculated.

---

## 📁 `types/` — Global TypeScript Declarations

### `types/index.ts`
**What:** Extends the default NextAuth type definitions.  
**Why:** By default, NextAuth's `Session` type doesn't include `userId` or `role`. This file tells TypeScript: "Our session ALSO has these extra fields."  
**How:** Uses TypeScript's **module augmentation** (`declare module "next-auth"`). Adds `userId: string` and `role: "customer" | "admin"` to the `Session.user` type.

This means everywhere in the codebase when you do `session.user.role`, TypeScript knows the type instead of showing an error.

---

## 📁 `public/` — Static Assets

Files here are served directly at `http://localhost:3000/filename`.

| File | Purpose |
|------|---------|
| `brg-logo.webp` | Brand logo used in Navbar and Footer |
| `hero.png`, `hero_fashion.jpg`, `hero_light_fashion.jpg` | Hero carousel images |
| `trend_subscribe_fashion.jpg`, `trend_subscribe_illustration_clean.jpg` | Subscribe section background |
| `image.png`, `image copy.png` | Miscellaneous/dev images |
| `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Default Next.js template SVGs (not used in main UI) |

---

## 📁 `scripts/` — One-Time Utility Scripts

These are run manually via the command line, not part of the web server.

### `scripts/seed.ts` — Database Seeder
**What:** Populates the database with initial data.  
**How:** Run with `npm run seed`. Creates categories, sample products with fake Cloudinary image URLs, and a test admin user.  
**Why:** Needed to have data in the DB during development without manually entering everything through the admin panel.

### `scripts/promote-admin.ts` — Promote User to Admin
**What:** A quick script to change a user's `role` from `"customer"` to `"admin"`.  
**How:** Takes an email address, connects to MongoDB, updates that user's role.  
**Why:** The registration form always creates `role: "customer"`. This script is how you create the first admin account without going through the UI.

---

## ⚙️ Configuration Files

### `.env.local` — Environment Variables (SECRETS - never commit to Git!)

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_URL` | The URL of the app (used by NextAuth for redirects) |
| `NEXTAUTH_SECRET` | Secret key for signing JWT tokens (keep this very secret!) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary secret (used server-side only) |
| `RAZORPAY_KEY_ID` | Razorpay public key (safe to expose to frontend) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (server-side only!) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Prefixed with `NEXT_PUBLIC_` → available in browser code |

> **Why `NEXT_PUBLIC_` prefix?** Next.js only exposes env vars to the browser if they start with `NEXT_PUBLIC_`. This is a security feature — your secrets stay on the server.

---

### `next.config.ts` — Next.js Configuration

**What:** Configures how Next.js behaves.  
**Current config:** Allows `next/image` to load images from external hostnames:
- `res.cloudinary.com` — product images stored on Cloudinary
- `images.unsplash.com` — placeholder/seed images from Unsplash

Without this allowlist, `<Image src="https://res.cloudinary.com/...">` would throw a security error.

---

### `package.json` — Project Manifest

| Script | Command | What it does |
|--------|---------|-------------|
| `npm run dev` | `next dev` | Starts local development server with hot reload |
| `npm run build` | `next build` | Compiles the app for production |
| `npm run start` | `next start` | Serves the production build |
| `npm run lint` | `eslint` | Checks code for style/quality issues |
| `npm run seed` | `ts-node ... scripts/seed.ts` | Populates the database with sample data |

**Key dependencies:**
| Package | Purpose |
|---------|---------|
| `next` (16.3.0) | The core framework |
| `react`, `react-dom` (19) | UI library |
| `mongoose` | MongoDB ODM (Object Document Mapper) |
| `next-auth` (v5 beta) | Authentication |
| `@auth/mongodb-adapter` | NextAuth adapter for MongoDB |
| `bcryptjs` | Password hashing |
| `cloudinary` | Image upload/management |
| `razorpay` | Payment gateway |
| `zod` | Runtime data validation |
| `lucide-react` | Icon library |

---

### `tsconfig.json` — TypeScript Configuration

Configures how TypeScript compiles the code. Key settings:
- `"strict": true` — enables strict type checking (catches more bugs at compile time)
- `"paths": { "@/*": ["./*"] }` — enables the `@/` import alias (so you can write `import X from "@/lib/auth"` instead of `../../lib/auth`)
- `"target": "ES2017"` — compiles to modern JavaScript

### `tsconfig.seed.json` — Seed Script TypeScript Config

A separate TypeScript config just for running the seed scripts with `ts-node`. The main `tsconfig.json` is optimized for Next.js (doesn't work with raw `ts-node`), so seed scripts get their own config that allows direct Node.js execution.

---

## 🧭 How It All Connects — Request Flow Example

Here's what happens when a customer **adds a product to their cart**:

```
1. Customer clicks "Add to Cart" on /shop/premium-black-tee
       ↓
2. AddToCartButton.tsx (client component) — onClick fires
       ↓
3. Calls addToCart() from CartContext.tsx
       ↓
4. CartContext makes POST to /api/cart/items
       ↓
5. app/api/cart/items/route.ts handles the request:
   - Calls requireAuth() from lib/auth.ts → checks JWT session
   - Validates request body with cart.schema.ts (Zod)
   - Calls connectToDB() from lib/db/connect.ts
   - Finds or creates Cart document using Cart.model.ts
   - Upserts the item (adds if new, increments quantity if exists)
   - Returns updated cart
       ↓
6. CartContext updates its state with the new cart
       ↓
7. Navbar (which reads from CartContext) updates the cart badge count
```

---

## 📊 Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Client)                  │
│  React Components → CartContext → SessionProvider    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP requests
┌──────────────────────▼──────────────────────────────┐
│                  Next.js Server                      │
│  Server Components → API Routes (route.ts files)     │
│  lib/auth.ts → lib/db/connect.ts → lib/validations   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                  External Services                    │
│  MongoDB Atlas (data) │ Cloudinary (images)          │
│  Razorpay (payments)  │ NextAuth JWT (sessions)      │
└─────────────────────────────────────────────────────┘
```

---

*Generated for BRGFinery — Last updated: 2026-08-11*
