# WanderLust 🌍✨
> **"Vacation Rental & Booking Platform — supercharged with MERN & Socket.IO."**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![Cashfree](https://img.shields.io/badge/Payments-Cashfree-00B259)](https://www.cashfree.com/)

---

## 🚀 Overview

**WanderLust** is a production-style full-stack vacation rental marketplace built with the **MERN Stack**. It connects guests, hosts, and administrators through a complete marketplace experience including property discovery, interactive booking workflows, secure payments via Cashfree, real-time guest-host chat with Socket.IO, user reviews, cloud asset management with Cloudinary, and admin moderation controls.

---

## ✨ Key Features

### 👤 Guest Experience
- **Property Discovery**: Interactive map and grid view for searching vacation rentals.
- **Detailed Listings**: High-resolution image carousels, pricing breakdown, interactive location maps, and host information.
- **Instant Bookings**: Seamless reservation workflow with date range selection and real-time availability checks.
- **Online Checkout**: Secure checkout and webhook transaction verification powered by **Cashfree Payments**.
- **Wishlist & Chat**: Save favorite properties and communicate directly with hosts via real-time messaging.

### 🏠 Host Dashboard
- **Host Onboarding**: One-click upgrade from user to host role.
- **Property Management**: Create, update, or remove listings with custom pricing, amenities, and locations.
- **Cloud Uploads**: Upload property imagery processed via Multer and stored on Cloudinary CDN.
- **Booking Management**: Review, approve, or manage incoming guest stay requests.

### 🛡️ Admin Moderation
- **Platform Analytics**: Monitor platform performance metrics, registered users, and total bookings.
- **Content Moderation**: Review, feature, or suspend property listings and accounts to maintain safety guidelines.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite
- **State Management**: Zustand
- **Routing**: React Router v6
- **Styling**: Tailwind CSS, Radix UI, Swiper (Carousels)
- **Maps & Real-Time**: Leaflet / React Leaflet, Socket.IO Client
- **Authentication**: Clerk React
- **Utilities**: Axios, React Hook Form, Zod, React Hot Toast

### Backend
- **Runtime**: Node.js, Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: Clerk Express, JWT, Password Hashing (`bcryptjs`)
- **Real-Time Engine**: Socket.IO WebSockets
- **File Uploads**: Multer, Cloudinary
- **Payments**: Cashfree SDK & Webhooks
- **Security**: Helmet, Express Rate Limit, CORS, Morgan

---

## 📁 Repository Structure

```text
Wander_Lust/
├── client/                     # React 19 + Vite Frontend Application
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Modals, Cards, Maps)
│   │   ├── pages/              # Page views (Home, ListingDetails, Dashboard, Admin)
│   │   ├── store/              # Zustand global state stores
│   │   ├── services/           # Axios API services & Socket.IO client
│   │   └── App.jsx             # Router and layout setup
│   └── package.json
│
├── server/                     # Node.js + Express Backend REST API
│   ├── config/                 # Database & Cloudinary connections
│   ├── controllers/            # Controller business logic
│   ├── middlewares/            # Auth, validation, & error handling
│   ├── models/                 # Mongoose database schemas
│   ├── routes/                 # Express API routes
│   ├── socket/                 # Socket.IO real-time event handlers
│   ├── utils/                  # Payment & helper utilities
│   └── server.js               # Entry point (HTTP & WebSocket server)
│
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- Credentials for **Clerk**, **Cloudinary**, and **Cashfree Payments**

---

### 1. Clone the Repository
```bash
git clone https://github.com/isha-gohel181/Wander_Lust.git
cd Wander_Lust
```

---

### 2. Configure Environment Variables

#### Client Configuration (`client/.env`)
```env
VITE_API_URL=http://localhost:10000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

#### Server Configuration (`server/.env`)
```env
PORT=10000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:10000

CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_NOTIFY_URL=http://localhost:10000/api/payment/webhook
CASHFREE_RETURN_URL=http://localhost:5173/booking/success
```

---

### 3. Run the Application

#### Start the Backend Server
```bash
cd server
npm install
npm run dev
```
*Backend API server will start at `http://localhost:10000`*

#### Start the Frontend Client
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
*Frontend web application will start at `http://localhost:5173`*

---

## 📡 Complete API Reference

### 🌐 System & Webhooks
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | API health check & status |
| `POST` | `/api/auth/webhook` | Public | Clerk authentication webhook listener |

---

### 🏠 Property Management (`/api/properties`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/properties` | Public | List & search property listings with filters |
| `GET` | `/api/properties/:id` | Public | Get single property details |
| `GET` | `/api/properties/host/my-properties` | Host | Get host's own property listings |
| `POST` | `/api/properties` | Host | Create a new property listing |
| `PUT` | `/api/properties/:id` | Host | Update an existing property listing |
| `DELETE` | `/api/properties/:id` | Host | Delete a property listing |
| `POST` | `/api/properties/:id/images` | Host | Upload & attach images to property |

---

### 📅 Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Guest | Create a new stay booking reservation |
| `GET` | `/api/bookings/my-bookings` | Guest | View guest's personal booking history |
| `GET` | `/api/bookings/host-bookings` | Host | View incoming bookings for host properties |
| `GET` | `/api/bookings/all` | Admin | View all platform bookings |
| `PATCH` | `/api/bookings/:id/status` | Auth | Update booking status (confirm/cancel) |

---

### 💳 Payments (`/api/payment`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payment/create-order` | Guest | Generate Cashfree payment order session |
| `POST` | `/api/payment/verify` | Guest | Verify payment signature and order status |
| `POST` | `/api/payment/webhook` | Public | Cashfree asynchronous payment webhook |

---

### 💬 Messages & Chat (`/api/messages`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages/conversations` | Auth | List user active chat conversations |
| `GET` | `/api/messages/conversations/:id` | Auth | Get message logs for a conversation |
| `POST` | `/api/messages/conversations` | Auth | Start a new conversation thread |
| `POST` | `/api/messages/conversations/:id` | Auth | Send a chat message |
| `PUT` | `/api/messages/conversations/:id/read` | Auth | Mark conversation messages as read |

---

### ⭐ Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews/property/:propertyId` | Public | Get all guest reviews for a property |
| `POST` | `/api/reviews` | Guest | Submit rating and review after a stay |

---

### 👤 User Management (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Auth | Fetch user profile data |
| `PUT` | `/api/users/profile` | Auth | Update user profile details |

---

### 🛡️ Admin Moderation (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/analytics` | Admin | View overall platform metrics and stats |
| `GET` | `/api/admin/users` | Admin | View list of all registered users |
| `PUT` | `/api/admin/users/:userId/role` | Admin | Update user access role |
| `PUT` | `/api/admin/users/:userId/suspend` | Admin | Suspend or unsuspend user account |
| `GET` | `/api/admin/properties` | Admin | View & inspect all listings |
| `GET` | `/api/admin/properties/stats` | Admin | Property stats breakdown |
| `PUT` | `/api/admin/properties/:id/status` | Admin | Approve/Reject property status |
| `PUT` | `/api/admin/properties/:id/featured` | Admin | Toggle property featured status |
| `DELETE` | `/api/admin/properties/:id` | Admin | Delete non-compliant property |
| `PUT` | `/api/admin/properties/bulk` | Admin | Bulk update properties status |
| `GET` | `/api/admin/bookings` | Admin | View platform-wide booking logs |
| `GET` | `/api/admin/reviews` | Admin | View user reviews for moderation |
| `PUT` | `/api/admin/reviews/:id/moderate` | Admin | Moderate or remove abusive review |

---

## 🌐 Production Deployment Notes

### Frontend (Vercel)
- Set `VITE_API_URL` to your live backend domain (e.g. `https://wander-lust-api.onrender.com/api`).
- Configure single-page application (SPA) rewrite rules if needed.

### Backend (Render)
- Deploy the `server/` directory on Render.
- Set `NODE_ENV=production` and add all required production secrets in environment variables.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  Crafted with ❤️ by <b>Isha Gohel</b>
</p>
