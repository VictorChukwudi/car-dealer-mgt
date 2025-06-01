#  Car Dealer API

A RESTful API for a car dealership management system built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. It enables customers and managers to register, log in, and manage cars, categories, and purchases.

---

## ✨ Features

- ✅ User authentication with JWT (Customer & Manager roles)
- 🚘 Car CRUD (Add, update, delete, and view cars)
- 📦 Category CRUD (Manage car categories)
- 💰 Car purchase functionality for customers
- 🔐 Role-based access control for endpoints
- 🧪 Unit testing with Jest
- 📄 Postman API documentation available

---

## 🛠 Technologies Used

- **[Node.js](https://nodejs.org/en)** – Server-side JavaScript runtime  
- **[Express.js](https://expressjs.com/)** – Web framework for APIs  
- **[TypeScript](https://www.typescriptlang.org/docs)** – Static type-checking for JavaScript  
- **[MongoDB](https://www.mongodb.com/)** – NoSQL document-based database  
- **[Mongoose](https://mongoosejs.com/)** – MongoDB object modeling  
- **[Jest](https://jestjs.io/)** – Testing framework  

---

## ⚙️ Getting Started

### 🔒 Prerequisites

- Node.js and npm installed
- MongoDB instance or Atlas URI

### 🚀 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/VictorChukwudi/car-dealer-mgt.git
   cd car-dealer-mgt
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. To run unit tests
   ```bash
   npm test
   ```

---

## 🧭 API Endpoints

All endpoints are prefixed with `/api`

### 🔐 Authentication

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/auth/register/customer` | Register customer |
| POST   | `/auth/login/customer`    | Login and get JWT token (customer)  |
| POST   | `/auth/register/manager` | Register manager |
| POST   | `/auth/login/manager` | Login and get JWT token (manager) |
### 🚘 Cars

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/cars`          | Get all cars             |
| GET    | `/cars/:id`      | Get car by ID            |
| POST   | `/cars`          | Create car *(manager)*   |
| PUT    | `/cars/:id`      | Update car *(manager)*   |
| DELETE | `/cars/:id`      | Delete car *(manager)*   |

### 📦 Categories

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| GET    | `/categories`      | Get all categories         |
| POST   | `/categories`      | Create category *(manager)*|
| PUT    | `/categories/:id`  | Update category *(manager)*|
| DELETE | `/categories/:id`  | Delete category *(manager)*|

### 💰 Purchases

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | `/purchase/:carId`| Purchase a car *(customer)* |

---

## 📂 Project Structure

```
src/
├── tests/             # Unit tests
├── config/            # Configuration files
├── controllers/       # Request handlers
├── helpers/           # Helper functions
├── middlewares/       # Auth, role, validation,etc. checks
├── models/            # Mongoose schemas
├── routes/            # API routes
├── services/          # Business logic
├── server.ts          # Entry point
```

---

## 📄 API Documentation

Access full documentation including example requests and response schemas:

👉 [View on Postman](https://documenter.getpostman.com/view/19721625/2sB2qgeJiB)

---


