# Project X - Bulk User Management API

A high-performance Express.js + MongoDB API for bulk user operations with built-in rate limiting, validation, and database export capabilities.

**Live Deployment:** https://project-x-mxtb.onrender.com

---

## 📋 Project Overview

This is an assignment project implementing bulk CRUD operations for user management with the following features:

- Bulk create users (handles 5,000+ users per request)
- Bulk update users with partial success handling
- Input validation using express-validator
- Rate limiting to prevent abuse
- Email uniqueness checks
- Database export in BSON and JSON formats

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB + Mongoose 9.3.3
- **Validation:** express-validator 7.3.1
- **Rate Limiting:** express-rate-limit 8.3.1
- **Environment:** dotenv 17.3.1
- **Dev Tool:** nodemon 3.1.14

---

## 📁 Project Structure

```
project-x/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── user.controller.js    # Bulk operations logic
│   ├── middlewares/
│   │   ├── globalErrorHandler.js # Error handling
│   │   ├── rateLimiter.js        # Rate limiting (50 req/15 min)
│   │   ├── validateResult.js     # Validation result processor
│   │   └── validators.js         # Input validators
│   ├── models/
│   │   └── user.model.js         # User schema
│   └── routes/
│       └── user.routes.js        # API routes
├── index.js                       # Server entry point
├── package.json
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- MongoDB Database Tools (mongodump, mongoexport)

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/project-x
PORT=3000
```

For MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project-x
PORT=3000
```

### Run the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:3000`

---

## 📡 API Endpoints

### 1. Bulk Create Users

**POST** `/api/users/bulk-create`

Create multiple users in one request.

**Request Body:**

```json
[
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  },
  {
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "0987654321"
  }
]
```

**Response (201):**

```json
{
  "message": "Users inserted successfully",
  "insertedCount": 2,
  "data": [
    { "_id": "...", "fullName": "John Doe", "email": "john@example.com", ... },
    { "_id": "...", "fullName": "Jane Smith", "email": "jane@example.com", ... }
  ]
}
```

**Validations:**

- Request body must be an array
- fullName: required, minimum 3 characters
- email: required, valid email format, unique in database
- phone: required, numeric only, unique in database

---

### 2. Bulk Update Users

**PUT** `/api/users/bulk-update`

Update multiple users in one request.

**Request Body:**

```json
[
  {
    "_id": "user_id_1",
    "fullName": "John Updated"
  },
  {
    "_id": "user_id_2",
    "email": "jane.new@example.com"
  }
]
```

**Response (200):**

```json
{
  "message": "Bulk update completed",
  "result": {
    "ok": 1,
    "n": 2,
    "nModified": 2
  }
}
```

**Validations:**

- Request body must be an array
- \_id: required for each update object

---

## ⚡ Performance Specifications

✅ **Handles minimum 5,000 users per bulk request**

- Express JSON payload limit set to 50MB
- Bulk operations use MongoDB's `insertMany()` and `bulkWrite()`

✅ **No individual save() inside loops**

- Uses batch operations (insertMany, bulkWrite)
- Single database round trip for all operations

✅ **Won't crash under bulk load**

- `ordered: false` allows partial success
- Returns HTTP 207 for mixed success/failure
- Proper error handling with meaningful messages

---

## 🛡️ Security Features

### Rate Limiting

- **Limit:** 50 requests per 15-minute window per IP
- **Applied to:** `/api/users/bulk-create` and `/api/users/bulk-update`
- **Status codes:** 429 (Too Many Requests)

### Validation

- Email format validation (regex)
- Phone number validation (numeric)
- Duplicate email detection in batch
- Duplicate email detection in database
- Input sanitization and trimming

### Error Handling

- Global error handler middleware
- Consistent error response format
- Validation error array responses (HTTP 400)

---

## 📊 Database Export

### Export as BSON (Full Database Backup)

```bash
mongodump --uri "mongodb://localhost:27017/project-x" --out ./db_backup
```

This creates a `db_backup/` folder containing your entire database in BSON format.

### Export Users Collection as JSON

```bash
mongoexport --uri "mongodb://localhost:27017/project-x" --collection users --out ./users.json
```

This creates a `users.json` file with all user records in JSON format.

### For MongoDB Atlas:

```bash
mongodump --uri "mongodb+srv://username:password@cluster.mongodb.net/project-x" --out ./db_backup

mongoexport --uri "mongodb+srv://username:password@cluster.mongodb.net/project-x" --collection users --out ./users.json
```

---

## 📝 Assignment Checklist

- ✅ Bulk create users (with validations)
- ✅ Bulk update users (with partial success handling)
- ✅ Rate limiting (50 req/15 min)
- ✅ Input validation (email, phone, fullName)
- ✅ Email uniqueness checks (database + batch level)
- ✅ Performance optimization (5,000+ users support)
- ✅ Error handling middleware
- ✅ Database exports (BSON + JSON)

---

## 📦 Deliverables

When submitting this assignment, include:

1. **Full project source code**
2. **`db_backup/` folder** (BSON export from mongodump)
3. **`users.json` file** (JSON export from mongoexport)
4. **This README.md**

---

## 🔧 Troubleshooting

**Connection Error:**

- Verify MongoDB is running
- Check MONGO_URI in .env file
- Ensure network access if using MongoDB Atlas

**Rate Limit Hit:**

- Wait 15 minutes or use different IP
- Reduce request frequency

**Validation Errors:**

- Ensure emails are unique
- Phone must be numeric only
- fullName must be at least 3 characters

---

## 📄 License

ISC
