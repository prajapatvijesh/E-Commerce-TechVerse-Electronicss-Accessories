# TechVerse - Multi-Vendor Electronics Marketplace

## Project Overview

**TechVerse** is a modern, premium, and fully-featured Multi-Vendor Electronics & Accessories Marketplace. Designed with a stunning glassmorphism UI, smooth micro-animations, and a robust backend, it serves as a complete e-commerce solution. The platform connects customers with various vendors, allowing seamless product browsing, cart management, secure checkout, and vendor management through a dedicated admin dashboard.

## Features

- **Premium UI/UX:** Modern glassmorphism design, animated mesh background, smooth Framer Motion micro-animations, and integrated Light/Dark mode toggles across all apps.
- **Authentication & Authorization:** Secure JWT-based authentication with Role-Based Access Control (Customer, Vendor, Admin, SuperAdmin).
- **Multi-Vendor System:** Vendors can register, upload products, and manage their specific orders and analytics.
- **Product Management:** Complete CRUD for products, categories, and brands.
- **Shopping Experience:** Full Shopping Cart, Wishlist, Compare feature, and multi-step Checkout flow.
- **Interaction & Engagement:** Customer Reviews, Ratings, and a dedicated Q&A system for products.
- **Order Management:** Invoice generation (PDF), coupon/discount validation, and order tracking.
- **Global Settings:** CMS system for managing homepage hero banners, FAQs, and site-wide settings.
- **Communication:** Enquiry system for B2B quotes and a Contact Us form.

## Tech Stack

**Frontend (Client & Admin Apps):**
- React 18
- Vite
- TypeScript
- Tailwind CSS (Premium Styling & Dark Mode)
- Redux Toolkit & RTK Query
- React Router DOM
- Framer Motion (Animations)
- React Hook Form & Zod (Validation)

**Backend (API):**
- Node.js
- Express.js
- TypeScript
- MongoDB & Mongoose (Database)
- JSON Web Token (JWT Auth)
- Nodemailer (Email services)

**Architecture:**
- Turborepo (Monorepo setup)
- PNPM Workspaces

## Screenshots

*(Add your screenshots here before submitting)*

- **Homepage & Hero Section**: `![Homepage](./screenshots/home.png)`
- **Shop & Glassmorphism Filters**: `![Shop](./screenshots/shop.png)`
- **Product Details & Gallery**: `![Product Details](./screenshots/product.png)`
- **Cart & Order Summary**: `![Cart](./screenshots/cart.png)`
- **Checkout Flow**: `![Checkout](./screenshots/checkout.png)`
- **Admin/Vendor Dashboard**: `![Dashboard](./screenshots/dashboard.png)`

## Live Demo

- **Customer Storefront:** [https://e-commerce-tech-verse-electronicss-accessories-kuttn215l.vercel.app/](https://e-commerce-tech-verse-electronicss-accessories-kuttn215l.vercel.app/)
- **Admin/Vendor Dashboard:** [https://e-commerce-tech-verse-electronicss-accessories-admin-13q2asctb.vercel.app/](https://e-commerce-tech-verse-electronicss-accessories-admin-13q2asctb.vercel.app/)

*(**Demo Credentials** for evaluating the live site:)*
- **Admin**: `admin@techverse.com` | Pass: `password123`
- **Vendor**: `vendor1@techverse.com` | Pass: `password123`
- **Customer**: `customer1@techverse.com` | Pass: `password123`

## Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prajapatvijesh/E-Commerce-TechVerse-Electronicss-Accessories.git
   cd E-Commerce-TechVerse-Electronicss-Accessories
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create `.env` files based on the structure provided in the "Environment Variables" section below.

4. **Seed the Database (Optional but recommended for testing):**
   ```bash
   pnpm run seed
   ```

5. **Start the Development Server (Runs all apps concurrently):**
   ```bash
   pnpm run dev
   ```

6. **Access the Apps:**
   - Web Store: `http://localhost:3000`
   - Admin/Vendor Dashboard: `http://localhost:3001`
   - Backend API: `http://localhost:5000`

## Environment Variables

### Backend (`apps/api/.env`)
Create an `.env` file in `apps/api/` and add the following variables:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String
MONGO_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Cloudinary (For Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP (For Emails)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=your_smtp_email
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=noreply@techverse.com
FROM_NAME=TechVerse

# Frontend URLs for CORS and Email Links
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### Frontend (`apps/web/.env` and `apps/admin/.env`)
Create an `.env` file in both `apps/web/` and `apps/admin/` and add the backend API URL:

```env
VITE_API_URL=http://localhost:5000
```
*(Note: Change `http://localhost:5000` to your live API URL when deploying to production).*
