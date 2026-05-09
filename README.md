# Order App

A professional, production-ready application for order management with notifications and admin dashboard.

## Stack
- **Frontend:** React, Axios, React Hot Toast, React Router DOM
- **Backend:** Node.js, Express, better-sqlite3, JWT, bcryptjs
- **Database:** SQLite (easy migration to PostgreSQL)

## Features
- User authentication (JWT, refresh tokens, bcrypt password hashing)
- Role-based admin dashboard
- RESTful API for orders, notifications, users
- Notification system (in-app, pluggable for email/SMS)
- Rate limiting, security headers, CORS, input validation
- Centralized error handling and logging
- Modular, scalable codebase

## Folder Structure
```
server/
  config/
  middleware/
  routes/
  services/
  database/
  server.js
client/
  src/
    api/
    components/
    pages/
    context/
```

## Setup Instructions

### 1. Clone the repository
```
git clone <repo-url>
cd final
```

### 2. Backend Setup
```
cd server
cp ../.env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

### 3. Frontend Setup
```
cd ../client
npm install
npm run dev
```

### 4. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Environment Variables
See `.env.example` for all required variables.

## Notes
- All code is fully implemented, no placeholders.
- All routes and database operations have error handling and validation.
- No hardcoded secrets or incomplete code.
