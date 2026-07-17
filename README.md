# TechVerse - Multi-Vendor Electronics Marketplace

This is a COMPLETE production-ready Multi-Vendor Electronics & Accessories Marketplace called "TechVerse".

## Architecture

- **Monorepo**: Turborepo with pnpm workspaces
- **Frontend Apps**:
  - `apps/web`: Customer-facing storefront (Vite + React + TailwindCSS + Redux Toolkit)
  - `apps/admin`: Vendor and Admin dashboard (Vite + React + TailwindCSS + Redux Toolkit)
- **Backend**:
  - `apps/api`: Express.js backend with MongoDB Atlas
- **Shared Packages**:
  - `packages/shared`: Shared Typescript types, Zod schemas, utilities.
  - `packages/ui`: Shared React components (Buttons, Inputs, Modals, Tables, etc.) styled with Tailwind CSS.

## Features Implemented

- Full JWT Authentication and Role-based routing (Customer, Vendor, Admin)
- Complete Product CRUD with Categories, Brands, and Vendors.
- Complete Shopping Cart, Wishlist, and Checkout flows.
- Reviews and Q&A models.
- Discount Coupons validation.
- PDF Invoice Generation using `pdfkit`.
- Global Settings and CMS system.
- Analytics and Notifications.
- Backend and Frontend Unit Test scaffolding.

## Database Model Summary

The MongoDB database uses the following core schemas:

- **User**: Stores Customers, Vendors, Admins, and SuperAdmins (Role-based access, JWT auth).
- **Product**: Stores product details (price, stock, vendor, category, brand, images).
- **Order**: Stores checkout data, shipping address, payment status, and order items.
- **Category & Brand**: Taxonomy models for product classification.
- **Review**: Customer product reviews (1-5 stars, comments).
- **QA**: Q&A interactions between customers and vendors.
- **Wishlist**: Tracks favorite products per customer.
- **Enquiry**: B2B or wholesale quote requests from customers to vendors.
- **ContactMessage**: General contact form submissions from the store.
- **Coupon**: Discount codes with percentage or fixed reduction.
- **Notification**: In-app notifications for users.

## Demo Credentials

For evaluators and reviewers, you can use the following credentials to test the marketplace functionality:

**Password for all accounts:** `password123`

| Role            | Email                      |
| :-------------- | :------------------------- |
| **Super Admin** | `superadmin@techverse.com` |
| **Admin**       | `admin@techverse.com`      |
| **Vendor**      | `vendor1@techverse.com`    |
| **Customer**    | `customer1@techverse.com`  |

> **Note**: To load these accounts into the database, ensure you run the seed script as detailed below.

## How to Run Locally

1. **Install dependencies from root**:

```bash
pnpm install
```

2. **Seed the Database** (Loads Demo Users, Products, Categories, Orders):

```bash
pnpm run seed
```

3. **Setup Environment Variables**:

- In `apps/api/.env`, configure your MongoDB Atlas URI, JWT_SECRET, Cloudinary details, etc.

4. **Start the Development Server (runs all apps concurrently)**:

```bash
pnpm run dev
```

5. **Access the Apps**:

- Web Store: `http://localhost:3000`
- Admin/Vendor Dashboard: `http://localhost:3001`
- Backend API: `http://localhost:5000`

---

## 🚀 Deployment Instructions

### Frontend (Web Store) & Admin Dashboard (Vercel / Netlify)

Since both the Customer Store (`apps/web`) and the Admin Dashboard (`apps/admin`) are standard Vite + React applications, they can be deployed easily on Vercel or Netlify.

1. Connect your GitHub repository to Vercel.
2. Import the `apps/web` project.
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
   - Add Environment Variables (e.g., `VITE_API_URL=https://your-backend-api.onrender.com`).
3. Repeat the same steps for `apps/admin`.

_(A `vercel.json` file is included in the root to assist with monorepo deployments)._

### Backend API (Render / Heroku / Railway)

The backend (`apps/api`) is an Express application. We recommend **Render.com** for free/cheap hosting.

1. Connect your repository to Render.
2. Create a new **Web Service**.
3. **Root Directory**: `apps/api`
4. **Build Command**: `pnpm install && pnpm run build`
5. **Start Command**: `pnpm run start` (or `node dist/server.js`)
6. Add all required Environment Variables (`MONGO_URI`, `JWT_SECRET`, etc.).

_(A `render.yaml` blueprint is included in the root)._

---

## 🎥 Screen Recording Instructions

To evaluate this project, a screen recording of a full user flow is highly recommended.

**Suggested Flow to Record:**

1. **Customer Flow**: Open the Web Store -> Browse Products -> Filter by Price -> Add to Cart -> Checkout -> Apply Coupon -> Place Order.
2. **Vendor Flow**: Open Admin Dashboard -> Login as `vendor1@techverse.com` -> Show Dashboard Sales -> Manage Products -> See new Order.
3. **Admin Flow**: Login as `superadmin@techverse.com` -> View Global Analytics -> Manage Categories/Users.
4. **Features Demo**: Show Q&A, Review Submission, and the Contact Us form functionality.

_You can use tools like **OBS Studio**, **Loom**, or **Mac/Windows built-in screen recorders**._

---

## 📂 Postman Collection

A complete Postman collection is included in the root directory (`TechVerse_Postman_Collection.json`).

- Open Postman -> Click **Import** -> Select the JSON file.
- It includes endpoints for Auth, Products, Orders, Reviews, and Contact submission.
